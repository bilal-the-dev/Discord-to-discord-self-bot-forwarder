const { MessageFlags } = require('discord.js-selfbot-v13');
const config = require('../config.json');

function isEphemeral(message) {
   return message.flags.has(MessageFlags.FLAGS.EPHEMERAL);
}

function replaceMentions(message) {
   const mentions = config['mentions'][message.guild.id];

   if (!mentions) {
      return;
   }

   for (const mention of mentions) {
      message.content = message.content.replaceAll(mention['original'], mention['replaced']);
   }
}

function isDirectMessage(message) {
   return !message.guild;
}

module.exports = {
   isEphemeral,
   replaceMentions,
   isDirectMessage
};