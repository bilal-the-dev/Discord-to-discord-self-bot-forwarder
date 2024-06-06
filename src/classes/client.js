const { Client } = require("discord.js-selfbot-v13");
const MirrorWebhook = require("./webhook");
const config = require("../../config.json");
const {
	replaceMentions,
	replaceFilterWords,
	addReplyIfExist,
	addEditIfExist,
	replaceSpoilers,
} = require("../utils/messageManipulation");
const { verifyMessage } = require("../utils/messageVerification");
const { sendWebhook } = require("../utils/messageSend");
const messageMap = require("../cache/messageMap");
module.exports = class MirrorClient extends Client {
	constructor(options) {
		super(options);
		this.mirrors = this.loadMirrors();
		this.bindEvents();
	}

	loadMirrors() {
		const mirrors = {};

		for (const mirror of config["mirrors"]) {
			// destructure the mirror object
			const {
				webhook_url: url,
				use_webhook_profile: useCustomProfile,
				channel_id,
			} = mirror;

			const webhook = new MirrorWebhook({
				data: { url },
				useCustomProfile,
			});

			mirrors[channel_id] = webhook;
		}

		// console.log(mirrors);
		return mirrors;
	}

	bindEvents() {
		this.on("ready", this.onReady);
		this.on("messageCreate", this.onMessage);
	}

	onReady() {
		console.log(`${this.user.tag} is now mirroring >:)`);
		this.user.setPresence({ status: config["status"] });
	}

	async onMessage(message) {
		try {
			const webhook = this.mirrors[message.channel.id];
			await verifyMessage(webhook, message);
			await replaceMentions(message);
			replaceSpoilers(message);

			addReplyIfExist(message);

			const filteredContent = replaceFilterWords(message.content);

			const m = await sendWebhook(filteredContent, message, webhook);
			messageMap.addMessage(m, message.id);
		} catch (error) {
			// console.log(error.message);
		}
	}
};
