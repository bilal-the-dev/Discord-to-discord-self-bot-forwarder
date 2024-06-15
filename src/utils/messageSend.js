const sendWebhook = async (message, webhook) => {
	const { content, author, attachments, embeds } = message;

	const reply = {
		content: content || null,
		files: [...attachments.values()],
		// username: webhook.useCustomProfile ? webhook.name : author.username,
		// avatarURL: webhook.useCustomProfile
		// 	? webhook.avatarUrl
		// 	: author.displayAvatarURL(),
		embeds: embeds,
	};

	return await webhook.send(reply);
};

module.exports = { sendWebhook };
