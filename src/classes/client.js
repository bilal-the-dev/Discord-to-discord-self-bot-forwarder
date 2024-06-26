const { Client } = require("discord.js-selfbot-v13");

const { generateWebhook } = require("../utils/webhook");
const { mirrors, status } = require("../../config.json");

const { verifyMessage } = require("../utils/messageVerification");
const { sendWebhook } = require("../utils/messageSend");
const {
	addGuildName,
	removeInviteLinks,
	addReplyIfExists,
} = require("../utils/messageManipulation");
const messageMap = require("../cache/messageMap");

module.exports = class MirrorClient extends Client {
	constructor(options) {
		super(options);
		this.mirrors = this.loadMirrors();
		this.bindEvents();
	}

	loadMirrors() {
		const mirrorObj = {};

		for (const mirror of mirrors) {
			const {
				webhook_url,
				channel_id,
				name,
				allowed_senders,
				remove_discord_links,
				allowed_words,
			} = mirror;

			const webhook = generateWebhook(webhook_url);

			const data = {
				webhook,
				allowed_senders,
				name,
				remove_discord_links,
				allowed_words,
			};

			mirrorObj[channel_id] = data;
		}

		return mirrorObj;
	}

	bindEvents() {
		this.on("ready", this.onReady);
		this.on("messageCreate", this.onMessage);
	}

	async onReady() {
		console.log(`${this.user.tag} is now mirroring >:)`);

		this.user.setStatus(status);
	}

	async onMessage(message) {
		try {
			const { channelId } = message;

			const data = this.mirrors[channelId];

			await verifyMessage(data, message);

			const { webhook, name, remove_discord_links } = data;

			addReplyIfExists(message);

			addGuildName(name, message);
			removeInviteLinks(remove_discord_links, message);

			console.log(message.content);

			const m = await sendWebhook(message, webhook);
			messageMap.addMessage(message.id, m);
		} catch (error) {
			if (error.isOperational) return;
			console.log(error);
		}
	}
};
