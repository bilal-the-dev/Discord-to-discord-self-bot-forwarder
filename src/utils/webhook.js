const { WebhookClient } = require("discord.js-selfbot-v13");

const generateWebhook = (url) => new WebhookClient({ url });

module.exports = { generateWebhook };
