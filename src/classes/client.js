const { Client } = require("discord.js-selfbot-v13");
const mongoose = require("mongoose");

const MirrorWebhook = require("./webhook");
const {
	mirrors,
	IS_SPOILER_ON,
	status,
	IS_IMAGE_EMBED_REMOVAL_ON,
	MONGO_URI,
	SOURCE_GUILD_ID,
} = require("../../config.json");
const {
	replaceMentions,
	replaceFilterWords,
	addReplyIfExist,
	replaceSpoilers,
	replaceChannelMentions,
} = require("../utils/messageManipulation");
const { verifyMessage } = require("../utils/messageVerification");
const { sendWebhook } = require("../utils/messageSend");
const messageMap = require("../cache/messageMap");
const { replaceImageHyperLinks } = require("../utils/imageManipulation");
const { Thread } = require("../models/Thread");

module.exports = class MirrorClient extends Client {
	constructor(options) {
		super(options);
		this.mirrors = this.loadMirrors();
		this.bindEvents();
	}

	loadMirrors() {
		const mirrorObj = {};

		for (const mirror of mirrors) {
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

			mirrorObj[channel_id] = webhook;
		}

		return mirrorObj;
	}

	bindEvents() {
		this.on("ready", this.onReady);
		this.on("messageCreate", this.onMessage);
		this.on("messageCreate", this.OnthreadCreateMessage);
		this.on("messageCreate", this.onThreadMessage);
	}

	async onReady() {
		console.log(`${this.user.tag} is now mirroring >:)`);
		await mongoose.connect(MONGO_URI);

		console.log("Connected to the database 👽");
		this.user.setStatus(status);
	}

	async onMessage(message) {
		try {
			const {
				channel: { id: channelId, type },
				id,
			} = message;

			if (type === "GUILD_PUBLIC_THREAD") return;

			const webhook = this.mirrors[channelId];

			await verifyMessage(webhook, message);

			console.log(message.content);
			await replaceMentions(message);
			replaceChannelMentions(message);

			if (IS_SPOILER_ON) replaceSpoilers(message);
			// if (IS_IMAGE_EMBED_REMOVAL_ON) replaceImageHyperLinks(message);

			addReplyIfExist(message);

			replaceFilterWords(message);

			const m = await sendWebhook(message, webhook);
			messageMap.addMessage(m, id);
		} catch (error) {
			// console.log(error);
		}
	}

	async onThreadMessage(message) {
		try {
			const {
				channel: { id: channelId, type },
				id,
			} = message;

			if (type !== "GUILD_PUBLIC_THREAD") return;

			let doc = await Thread.findOne();

			if (!doc) return;

			const found = doc.threadIdsObj[channelId];

			if (!found) return;

			const webhook = this.mirrors[found[0]];

			await verifyMessage(webhook, message);
			await replaceMentions(message);

			replaceChannelMentions(message);

			if (IS_SPOILER_ON) replaceSpoilers(message);
			// if (IS_IMAGE_EMBED_REMOVAL_ON) replaceImageHyperLinks(message);

			addReplyIfExist(message);

			replaceFilterWords(message);

			const m = await sendWebhook(message, webhook, found[1]);
			messageMap.addMessage(m, id);
		} catch (error) {
			// console.log(error);
		}
	}

	async OnthreadCreateMessage(message) {
		try {
			const { system, type, id, channel, content: name } = message;

			if (!system || type !== "THREAD_CREATED") return;

			const webhook = this.mirrors[channel.id];

			if (!webhook) return;

			let doc = await Thread.findOne();

			if (!doc) doc = await Thread.create({});

			const parentChannel = this.channels.cache.get(webhook.channelId);
			const newlyCreatedThread = await channel.threads.fetch(id);

			await newlyCreatedThread.join();

			const threadOnSource = await parentChannel.threads.create({ name });

			doc.threadIdsObj[id] = [channel.id, threadOnSource.id];

			await doc.updateOne({
				threadIdsObj: doc.threadIdsObj,
			});
			const messageCollection = await newlyCreatedThread.messages.fetch();

			const fetchedMessage = messageCollection.last();
			await replaceMentions(fetchedMessage);
			replaceChannelMentions(fetchedMessage);

			if (IS_SPOILER_ON) replaceSpoilers(fetchedMessage);
			// if (IS_IMAGE_EMBED_REMOVAL_ON) replaceImageHyperLinks(fetchedMessage);

			addReplyIfExist(fetchedMessage);

			replaceFilterWords(fetchedMessage);

			const m = await sendWebhook(fetchedMessage, webhook, threadOnSource.id);

			messageMap.addMessage(m, fetchedMessage.id);
		} catch (error) {
			console.log(error);
		}
	}
};
