export function tokenizeTranscript(transcript = '') {
  if (!transcript.trim()) return [];

  return transcript.split(/\s+/).map((word, index) => ({
    id: index,
    text: word,
    selected: false,
  }));
}

export function toggleTokenSelection(tokens, tokenId) {
  return tokens.map((token) =>
    token.id === tokenId
      ? { ...token, selected: !token.selected }
      : token
  );
}

export function clearTokenSelections(tokens) {
  return tokens.map((token) => ({
    ...token,
    selected: false,
  }));
}

export function getSelectedTokens(tokens) {
  return tokens.filter((token) => token.selected);
}