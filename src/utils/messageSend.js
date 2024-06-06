const { MessageFlags } = require("discord.js-selfbot-v13");

const sendWebhook = async (filteredContent, message, webhook) => {
	const { content, author, guild, channel, attachments, embeds } = message;
	let reply = {};

	if (filteredContent !== content)
		// The message contains filtered words, so forward the filtered message instead
		reply = {
			content: filteredContent,
			username: `${author.username} | ${guild.name} | ${channel.name}`,
			avatarURL: author.displayAvatarURL(),
		};

	if (filteredContent === content)
		reply = {
			content: content || null,
			files: [...attachments.values()],
			username: webhook.useCustomProfile ? webhook.name : author.username,
			avatarURL: webhook.useCustomProfile
				? webhook.avatarUrl
				: author.displayAvatarURL(),
			embeds: embeds,
		};

	// reply.flags = MessageFlags.FLAGS.SUPPRESS_EMBEDS;

	return await webhook.send(reply);
};

module.exports = { sendWebhook };
