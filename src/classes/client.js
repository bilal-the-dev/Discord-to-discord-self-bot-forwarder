const { Client } = require("discord.js-selfbot-v13");

const { generateWebhook } = require("../utils/webhook");
const { mirrors, status } = require("../../config.json");

const { verifyMessage } = require("../utils/messageVerification");
const { sendWebhook } = require("../utils/messageSend");
const {
  addGuildName,
  removeInviteLinks,
  addReplyIfExists,
  removeEveryonePing,
  removeChannelMentions,
  removeRoles,
  removeUnknownUsers,
  removeWebLinks,
  removeEmojis,
} = require("../utils/messageManipulation");
const messageMap = require("../cache/messageMap");
const { useChatGptToConvertMessage } = require("../utils/openai");

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

      mirror.webhook = webhook;

      mirrorObj[channel_id] = mirror;
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

      console.log(
        `Message received in ${message.channel?.name} (${channelId})`
      );

      const data = this.mirrors[channelId];

      removeWebLinks(data?.remove_web_links, message);
      await verifyMessage(data, message);

      console.log("Forwarding");

      const {
        name,
        remove_everyone_ping,
        remove_discord_links,
        remove_channels,
        remove_roles,
        remove_unknown_users,
        remove_emojis,
      } = data;

      addReplyIfExists(message);

      removeInviteLinks(remove_discord_links, message);
      removeEmojis(remove_emojis, message);
      removeEveryonePing(remove_everyone_ping, message);
      removeChannelMentions(remove_channels, message);
      removeRoles(remove_roles, message);
      removeUnknownUsers(remove_unknown_users, message);

      message.content = await useChatGptToConvertMessage(data, message);

      addGuildName(name, message);
      const m = await sendWebhook(message, data);
      messageMap.addMessage(message.id, m);
    } catch (error) {
      if (error.isOperational) return;
      console.log(error);
    }
  }
};
