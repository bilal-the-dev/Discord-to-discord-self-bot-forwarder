const { Client } = require("discord.js-selfbot-v13");

const { generateWebhook } = require("../utils/webhook");
const { mirrors, status, SOURCE_GUILD_ID } = require("../../config.json");

const { verifyMessage } = require("../utils/messageVerification");
const { sendWebhook } = require("../utils/messageSend");

module.exports = class MirrorClient extends Client {
	constructor(options) {
		super(options);
		this.mirrors = this.loadMirrors();
		this.bindEvents();
	}

	loadMirrors() {
		const mirrorObj = {};

		for (const mirror of mirrors) {
			const { webhook_url, channel_id } = mirror;

			const webhook = generateWebhook(webhook_url);

			console.log(webhook);
			mirrorObj[channel_id] = webhook;
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

			const webhook = this.mirrors[channelId];

			await verifyMessage(webhook, message);

			console.log(message.content);

			await sendWebhook(message, webhook);
		} catch (error) {
			if (error.isOperational) return;
			console.log(error);
		}
	}
};
