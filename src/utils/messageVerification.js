const { MessageFlags } = require("discord.js-selfbot-v13");
const dayjs = require('dayjs')
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

const AppError = require("../classes/AppError");
const { containsWords } = require("./misc");

dayjs.extend(utc);
dayjs.extend(timezone);

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
    channel
  } = message;

  if (system || isDirectMessage(message) || isEphemeral(message) || !data)
    throw new AppError(errMsg);

  const { blocked_words, allowed_senders, allowed_words, forward_at_timezone } = data;

  if (blocked_words) containsBlockedWords(blocked_words, content, errMsg);

  if (allowed_words) containsAllowedWord(allowed_words, content, errMsg);

  if (allowed_senders) isAllowedSender(allowed_senders, id, errMsg);

  if(forward_at_timezone){
    const { timezone, forwardAfterHour, forwardBeforeHour } = forward_at_timezone

    const now = dayjs().tz(timezone)

    const startTime = now.hour(forwardAfterHour).minute(0).second(0)
    const endTime = now.hour(forwardBeforeHour).minute(0).second(0)
    
    if(now < startTime || now > endTime ) throw new AppError(`Message not within the specified time [${channel.name} (${channel.id})], Skipping!`);

  }
};

module.exports = {
  verifyMessage,
};
