const containsWords = (wordsArray, content) => {
  const escapedWords = wordsArray.map((word) =>
    word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const pattern = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "i");

  return pattern.test(content.toLowerCase());
};

module.exports = { containsWords };
