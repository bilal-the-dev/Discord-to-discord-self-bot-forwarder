const { Client } = require("discord.js-selfbot-v13");
const MirrorWebhook = require("./webhook");
const { isEphemeral, replaceMentions, isDirectMessage } = require("./utils");
const config = require("../config.json");

module.exports = class MirrorClient extends Client {
  constructor(options) {
    super(options);
    this.mirrors = this.loadMirrors();
    this.bindEvents();
  }

  loadMirrors() {
    const mirrors = {};

    for (const mirror of config["mirrors"]) {
      const webhooks = mirror["webhook_urls"].map((webhookUrl) => {
        return new MirrorWebhook({
          data: { url: webhookUrl },
          useCustomProfile: mirror["use_webhook_profile"],
        });
      });

      for (const channelId of mirror["channel_ids"]) {
        mirrors[channelId] = webhooks;
      }
    }

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

  onMessage(message) {
    if (message.system || isDirectMessage(message) || isEphemeral(message)) {
      return;
    }

    const webhooks = this.mirrors[message.channelId];

    if (!webhooks) {
      return;
    }

    const mentionLength = "<*000000000000000000>".length;

    if (message.content.length >= mentionLength) {
      replaceMentions(message);
    }
    let regex =
      /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;
    if (regex.test(message.content))
      for (const webhook of webhooks) {
        return webhook.deleteMessage;
        //    return webhook.send({
        //       content: `discord.gg/void`,
        //       username: message.author.username,
        //       avatarURL: message.author.avatarURL(),
        // })
      }
    const blacklist = config["blacklist"];
    const rege = new RegExp(`(\\b|\\d)(${blacklist.join("|")})(\\b|\\d)`, "i");
    if (rege.test(message.content))
      for (const webhook of webhooks) {
        return webhook.deleteMessage;
      }
      // const filterWords = {
      //   'bro': 'bruh',
      //   'bad_word_2': 'replacement_word_2'
      // };
    const filterWords = config["filterWords"];
    const regexx = new RegExp(
      `\\b(${Object.keys(filterWords).join("|")})\\b`,
      "gi"
    );
    const filteredContent = message.content.replace(
      regexx,
      (match) => filterWords[match.toLowerCase()]
    );

    if (filteredContent !== message.content) {
      // The message contains filtered words, so forward the filtered message instead
      for (const webhook of webhooks) {
        return webhook.send({
          content: filteredContent,
          username: `${message.author.username} | ${message.guild.name} | ${message.channel.name}`,
          avatarURL: message.author.avatarURL(),
        });
      }
    }

    for (const webhook of webhooks) {
      webhook
        .send({
          content: message.content.length ? message.content : null,
          files: [...message.attachments.values()],
          username: webhook.useCustomProfile
            ? webhook.name
            : message.author.username,
          avatarURL: webhook.useCustomProfile
            ? webhook.avatarUrl
            : message.author.displayAvatarURL(),
          embeds: message.embeds,
        })

        .catch(console.error);
    }
  }
};
