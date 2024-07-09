const { MessageFlags } = require("discord.js-selfbot-v13");
const AppError = require("../classes/AppError");
const { containsWords } = require("./misc");

const isEphemeral = (message) =>
  message.flags.has(MessageFlags.FLAGS.EPHEMERAL);

const isDirectMessage = (message) => !message.guild;

const isAllowedSender = (allowed_senders, authorId, errMsg) => {
  if (!allowed_senders.includes(authorId)) throw new AppError(errMsg);
};

function containsAllowedWord(allowedWords, content, errMsg) {
  if (!containsWords(allowedWords, content)) throw new AppError(errMsg);
}
function containsBlockedWords(blockedWords, content, errMsg) {
  if (containsWords(blockedWords, content)) throw new AppError(errMsg);
}

const verifyMessage = async (data, message) => {
  const errMsg = `Bypass failed: Not target message`;
  const {
    system,
    author: { id },
    content,
  } = message;

  if (system || isDirectMessage(message) || isEphemeral(message) || !data)
    throw new AppError(errMsg);

  const { blocked_words, allowed_senders, allowed_words } = data;

  if (blocked_words) containsBlockedWords(blocked_words, content, errMsg);

  if (allowed_words) containsAllowedWord(allowed_words, content, errMsg);

  if (allowed_senders) isAllowedSender(allowed_senders, id, errMsg);
};

module.exports = {
  verifyMessage,
};
