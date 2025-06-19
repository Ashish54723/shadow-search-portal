
// Search operators and special characters that should not be translated
const SEARCH_OPERATORS = ['AND', 'OR', 'NOT', '&', '|', '!'];
const SPECIAL_CHARACTERS = ['"', "'", '(', ')', '[', ']', '{', '}', '*', '?', '+', '-', '='];

export const preserveSearchOperators = (text: string): { preservedText: string; tokens: string[] } => {
  const tokens: string[] = [];
  let preservedText = text;
  
  // Preserve quoted strings (exact phrases)
  const quotedMatches = text.match(/"[^"]*"/g) || [];
  quotedMatches.forEach((match, index) => {
    const placeholder = `__QUOTED_${index}__`;
    tokens.push(match);
    preservedText = preservedText.replace(match, placeholder);
  });
  
  // Preserve search operators (case insensitive)
  SEARCH_OPERATORS.forEach(operator => {
    const regex = new RegExp(`\\b${operator}\\b`, 'gi');
    const matches = preservedText.match(regex) || [];
    matches.forEach((match, index) => {
      const placeholder = `__OPERATOR_${operator}_${index}__`;
      tokens.push(match);
      preservedText = preservedText.replace(match, placeholder);
    });
  });
  
  return { preservedText, tokens };
};

export const restoreSearchOperators = (translatedText: string, tokens: string[]): string => {
  let restoredText = translatedText;
  
  // Restore quoted strings
  tokens.forEach((token, index) => {
    if (token.startsWith('"') && token.endsWith('"')) {
      const placeholder = `__QUOTED_${index}__`;
      restoredText = restoredText.replace(placeholder, token);
    }
  });
  
  // Restore operators
  SEARCH_OPERATORS.forEach(operator => {
    const regex = new RegExp(`__OPERATOR_${operator}_\\d+__`, 'gi');
    restoredText = restoredText.replace(regex, operator);
  });
  
  return restoredText;
};

export const shouldTranslateString = (text: string): boolean => {
  // Don't translate if the string is only operators and special characters
  const cleanText = text.replace(/[^a-zA-Z]/g, '');
  return cleanText.length > 0;
};
