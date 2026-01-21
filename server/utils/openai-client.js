import axios from 'axios';

const SYSTEM_PROMPT = `You are a legal entity extraction specialist. Your task is to extract entities and relationships from legal documents and output them as a Mermaid diagram.

STRICT RULES:
1. Extract ONLY entities explicitly mentioned in the text - NO invention or inference
2. Use exact names as they appear in the document - NO normalization
3. Only use these entity classes: case, person, organisation, legal_issue, event, document, location
4. Output MUST start with "graph TD" or "graph LR"
5. Group entities by type in subgraphs
6. Use descriptive relationship labels
7. Apply CSS classes to nodes: :::case, :::person, :::organisation, :::legal_issue, :::event, :::document, :::location

OUTPUT FORMAT:
\`\`\`mermaid
graph TD
    subgraph organisations
        org1[ENTITY NAME]:::organisation
    end
    
    subgraph persons
        p1[PERSON NAME]:::person
    end
    
    subgraph locations
        loc1[LOCATION]:::location
    end
    
    subgraph events
        e1[EVENT DATE]:::event
    end
    
    subgraph documents
        d1[DOCUMENT NAME]:::document
    end
    
    subgraph legal_issues
        li1[ISSUE]:::legal_issue
    end
    
    org1 -->|relationship| p1
    p1 -->|relationship| loc1
    
    classDef organisation fill:#0a7ea4,stroke:#333,stroke-width:2px,color:#fff
    classDef person fill:#22C55E,stroke:#333,stroke-width:2px,color:#fff
    classDef location fill:#F59E0B,stroke:#333,stroke-width:2px,color:#fff
    classDef event fill:#EF4444,stroke:#333,stroke-width:2px,color:#fff
    classDef document fill:#9333EA,stroke:#333,stroke-width:2px,color:#fff
    classDef legal_issue fill:#EC4899,stroke:#333,stroke-width:2px,color:#fff
\`\`\`

When processing multiple documents, merge entities across documents without guessing or normalizing beyond exact text matches.`;

/**
 * Extract entities from documents using OpenAI API
 */
export async function extractEntities(request) {
  try {
    const { documents, apiKey, model } = request;

    // Prepare user message with all document texts
    const documentTexts = documents
      .map((doc, idx) => {
        return `=== DOCUMENT ${idx + 1}: ${doc.fileName} ===\n\n${doc.text}\n\n`;
      })
      .join('\n');

    const userMessage = `Extract legal entities and relationships from the following documents and output a Mermaid diagram:\n\n${documentTexts}`;

    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model || 'gpt-5-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        temperature: 1,
        max_completion_tokens: 4000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const content = response.data.choices?.[0]?.message?.content || '';

    // Extract Mermaid code from response
    const mermaidMatch = content.match(/```mermaid\n([\s\S]*?)\n```/);
    if (!mermaidMatch) {
      throw new Error('No Mermaid diagram found in response');
    }

    const mermaidCode = mermaidMatch[1].trim();

    // Count entities and relationships
    const entityCounts = countEntities(mermaidCode);
    const relationshipCount = countRelationships(mermaidCode);

    return {
      mermaidCode,
      entities: entityCounts,
      relationships: relationshipCount,
      success: true,
    };
  } catch (error) {
    console.error('OpenAI error:', error.response?.data || error.message);
    return {
      mermaidCode: '',
      entities: {},
      relationships: 0,
      success: false,
      error: error.response?.data?.error?.message || error.message || 'Unknown error',
    };
  }
}

/**
 * Count entities by type in Mermaid code
 */
function countEntities(mermaidCode) {
  const counts = {
    case: 0,
    person: 0,
    organisation: 0,
    legal_issue: 0,
    event: 0,
    document: 0,
    location: 0,
  };

  const entityTypes = ['case', 'person', 'organisation', 'legal_issue', 'event', 'document', 'location'];

  for (const type of entityTypes) {
    const regex = new RegExp(`:::${type}`, 'g');
    const matches = mermaidCode.match(regex);
    counts[type] = matches ? matches.length : 0;
  }

  return counts;
}

/**
 * Count relationships in Mermaid code
 */
function countRelationships(mermaidCode) {
  const relationshipRegex = /--[>|\-]/g;
  const matches = mermaidCode.match(relationshipRegex);
  return matches ? matches.length : 0;
}

/**
 * Test OpenAI API key
 */
export async function testApiKey(apiKey, model) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model || 'gpt-5-mini',
        messages: [{ role: 'user', content: 'Test' }],
        max_completion_tokens: 5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}
