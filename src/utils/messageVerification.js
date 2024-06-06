const { MessageFlags } = require("discord.js-selfbot-v13");
const { blacklist } = require("../../config.json");

const blacklistRegex = new RegExp(
	`(\\b|\\d)(${blacklist.join("|")})(\\b|\\d)`,
	"i"
);
let linksRegex =
	/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;

const isEphemeral = (message) =>
	message.flags.has(MessageFlags.FLAGS.EPHEMERAL);

const isDirectMessage = (message) => !message.guild;

const verifyBlockedLinks = (content) => linksRegex.test(content);

const verifyBlockedWords = (content) => blacklistRegex.test(content);

const verifyMessage = async (webhook, message) => {
	const errMsg = "Bypass failed:";
	const { system, content } = message;

	if (system || isDirectMessage(message) || isEphemeral(message) || !webhook)
		throw new Error(`${errMsg} Not target message`);

	if (verifyBlockedLinks(content) || verifyBlockedWords(content))
		throw new Error(`${errMsg} Message contains not allowed words`);
};

module.exports = {
	verifyMessage,
};
