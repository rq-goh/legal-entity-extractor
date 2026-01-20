/**
 * Validate Mermaid diagram syntax and rules
 */
export function validateMermaidDiagram(mermaidCode) {
  const errors = [];
  const warnings = [];

  if (!mermaidCode || !mermaidCode.trim()) {
    errors.push('Mermaid code is empty');
    return { isValid: false, errors, warnings };
  }

  const code = mermaidCode.trim();

  // Check for graph declaration
  if (!code.match(/^\s*(graph\s+(TD|LR|BT|RL)|flowchart\s+(TD|LR|BT|RL))/i)) {
    errors.push('Diagram must start with "graph TD", "graph LR", "graph BT", or "graph RL"');
  }

  // Check for invalid entity classes
  const allowedClasses = ['case', 'person', 'organisation', 'legal_issue', 'event', 'document', 'location'];
  const classMatches = code.match(/:::(\w+)/g) || [];
  const uniqueClasses = new Set(classMatches.map(m => m.replace(':::', '')));

  for (const cls of uniqueClasses) {
    if (!allowedClasses.includes(cls)) {
      errors.push(`Invalid entity class: ${cls}. Allowed: ${allowedClasses.join(', ')}`);
    }
  }

  // Check for subgraphs
  const hasSubgraphs = code.match(/subgraph\s+\w+/gi);
  if (!hasSubgraphs) {
    warnings.push('No subgraphs found. Consider organizing entities by type.');
  }

  // Check for relationships
  const relationshipCount = (code.match(/--[>|\-]/g) || []).length;
  if (relationshipCount === 0) {
    warnings.push('No relationships defined. Diagram may only show isolated entities.');
  }

  // Check for node definitions
  const nodeCount = (code.match(/\[\w+\]/g) || []).length;
  if (nodeCount === 0) {
    errors.push('No entities defined in diagram');
  }

  // Check for balanced brackets
  const openBrackets = (code.match(/\[/g) || []).length;
  const closeBrackets = (code.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    errors.push('Unbalanced brackets in diagram');
  }

  // Check for class definitions
  const hasClassDefs = code.match(/classDef\s+\w+/gi);
  if (!hasClassDefs) {
    warnings.push('No CSS class definitions found. Diagram may not render with colors.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Extract entity statistics from Mermaid diagram
 */
export function extractEntityStats(mermaidCode) {
  const stats = {
    totalEntities: 0,
    totalRelationships: 0,
    entitiesByType: {
      case: 0,
      person: 0,
      organisation: 0,
      legal_issue: 0,
      event: 0,
      document: 0,
      location: 0,
    },
  };

  if (!mermaidCode) return stats;

  // Count entities by type
  const entityTypes = ['case', 'person', 'organisation', 'legal_issue', 'event', 'document', 'location'];
  for (const type of entityTypes) {
    const regex = new RegExp(`:::${type}`, 'g');
    const matches = mermaidCode.match(regex);
    const count = matches ? matches.length : 0;
    stats.entitiesByType[type] = count;
    stats.totalEntities += count;
  }

  // Count relationships
  const relationshipRegex = /--[>|\-]/g;
  const matches = mermaidCode.match(relationshipRegex);
  stats.totalRelationships = matches ? matches.length : 0;

  return stats;
}

/**
 * Merge multiple Mermaid diagrams
 */
export function mergeMermaidDiagrams(diagrams) {
  if (!diagrams || diagrams.length === 0) {
    return '';
  }

  if (diagrams.length === 1) {
    return diagrams[0];
  }

  // Extract graph type from first diagram
  const graphTypeMatch = diagrams[0].match(/^(graph\s+[A-Z]+)/i);
  const graphType = graphTypeMatch ? graphTypeMatch[1] : 'graph TD';

  // Collect all subgraphs and relationships
  const subgraphs = new Map();
  const relationships = new Set();
  const classDefs = new Set();

  for (const diagram of diagrams) {
    // Extract subgraphs
    const subgraphMatches = diagram.match(/subgraph\s+(\w+)\s*\n([\s\S]*?)\nend/gi) || [];
    for (const match of subgraphMatches) {
      const nameMatch = match.match(/subgraph\s+(\w+)/i);
      const name = nameMatch ? nameMatch[1] : '';
      if (name && !subgraphs.has(name)) {
        subgraphs.set(name, match);
      }
    }

    // Extract relationships
    const relMatches = diagram.match(/\w+\s*--[>|\-][^;]*;?/g) || [];
    for (const rel of relMatches) {
      relationships.add(rel.trim());
    }

    // Extract class definitions
    const classMatches = diagram.match(/classDef\s+\w+[^;]*;?/g) || [];
    for (const cls of classMatches) {
      classDefs.add(cls.trim());
    }
  }

  // Build merged diagram
  let merged = `${graphType}\n`;

  // Add subgraphs
  for (const subgraph of subgraphs.values()) {
    merged += `    ${subgraph}\n\n`;
  }

  // Add relationships
  for (const rel of relationships) {
    merged += `    ${rel}\n`;
  }

  // Add class definitions
  merged += '\n';
  for (const classDef of classDefs) {
    merged += `    ${classDef}\n`;
  }

  return merged;
}
