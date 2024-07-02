const sendWebhook = async (message, webhook, custom_names) => {
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

	if (custom_names && custom_names[author.id])
		reply.username = custom_names[author.id];

	return await webhook.send(reply);
};

module.exports = { sendWebhook };
