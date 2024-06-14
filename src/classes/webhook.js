const { WebhookClient } = require("discord.js-selfbot-v13");

module.exports = class MirrorWebhook extends WebhookClient {
	constructor(webhook) {
		super(webhook.data, webhook.options);
		this.useCustomProfile = webhook.useCustomProfile;
		this.fillChannel();
		if (!this.useCustomProfile) {
			return;
		}

		this.name = null;
		this.avatar = null;
		this.avatarUrl = null;
		this.fetchData();
	}

	async fetchData() {
		try {
			const response = await fetch(this.url);
			const data = await response.json();
			this.fillData(data);
		} catch (error) {
			console.error("Failed to fetch webhook data:", error);
		}
	}

	fillData(data) {
		this.name = data["name"];
		this.avatar = data["avatar"];
		this.avatarUrl = this.avatarURL(this.avatar);
	}

	async fillChannel() {
		try {
			const response = await fetch(this.url);
			const data = await response.json();
			this.channelId = data["channel_id"];
		} catch (error) {
			console.error("Failed to fetch webhook data:", error);
		}
	}
	avatarURL() {
		if (this.avatarUrl) {
			return this.avatarUrl;
		}

		if (!this.avatar) {
			return null;
		}

		return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.webp`;
	}
};
