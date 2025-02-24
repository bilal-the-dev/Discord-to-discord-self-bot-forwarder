const sendWebhook = async (message, data) => {
	const {
		content,
		author: { id, username },
		author,
		attachments,
		embeds,
	} = message;
	const { webhook, custom_names, use_user_profile, remove_embed_title_footer } = data;

	if(remove_embed_title_footer) embeds.forEach(e => {
		e..title && 	(e.title = '')
		e.footer &&  (e.footer = '')
	});
	
	const reply = {
		content: content || null,
		files: [...attachments.values()],
		// username: webhook.useCustomProfile ? webhook.name : author.username,
		// avatarURL: webhook.useCustomProfile
		// 	? webhook.avatarUrl
		// 	: author.displayAvatarURL(),
		embeds: embeds,
	};

	if (custom_names && custom_names[id]) reply.username = custom_names[id];

	if (use_user_profile) {
		reply.username = username;
		reply.avatarURL = author.displayAvatarURL();
	}

	return await webhook.send(reply);
};

module.exports = { sendWebhook };
