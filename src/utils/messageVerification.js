const { MessageFlags } = require("discord.js-selfbot-v13");
const AppError = require("../classes/AppError");

const isEphemeral = (message) =>
	message.flags.has(MessageFlags.FLAGS.EPHEMERAL);

const isDirectMessage = (message) => !message.guild;

const isAllowedSender = (allowed_senders, authorId, errMsg) => {
	if (!allowed_senders.includes(authorId)) throw new AppError(errMsg);
};

function containsAllowedWord(allowedWords, content, errMsg) {
	const escapedWords = allowedWords.map((word) =>
		word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
	);

	// Create a regex pattern with word boundaries
	const pattern = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "i");

	if (!pattern.test(content.toLowerCase())) throw new AppError(errMsg);
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

	if (!data.allowed_senders && !data.allowed_words) return;

	console.log(data.allowed_words);
	if (data.allowed_words)
		containsAllowedWord(data.allowed_words, content, errMsg);

	if (data.allowed_senders) isAllowedSender(data.allowed_senders, id, errMsg);
};

module.exports = {
	verifyMessage,
};
