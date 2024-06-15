const { MessageFlags } = require("discord.js-selfbot-v13");
const AppError = require("../classes/AppError");

const isEphemeral = (message) =>
	message.flags.has(MessageFlags.FLAGS.EPHEMERAL);

const isDirectMessage = (message) => !message.guild;

const verifyMessage = async (webhook, message) => {
	const errMsg = "Bypass failed:";
	const { system } = message;

	if (system || isDirectMessage(message) || isEphemeral(message) || !webhook)
		throw new AppError(`${errMsg} Not target message`);
};

module.exports = {
	verifyMessage,
};
