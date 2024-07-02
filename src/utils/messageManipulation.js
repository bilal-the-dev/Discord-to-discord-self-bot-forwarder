const messageMap = require("../cache/messageMap");
const { SOURCE_GUILD_ID } = require("./../../config.json");

exports.addGuildName = (name, message) => {
	if (name) message.content = `## ${name}:\n${message.content}`;
};

exports.removeInviteLinks = (remove_discord_links, message) => {
	if (!remove_discord_links) return;
	const discordInviteRegex =
		/https?:\/\/(www\.)?discord(?:app\.com\/invite|\.gg|\.com\/invite)\/[a-zA-Z0-9-]{2,255}/gi;

	message.content = message.content.replace(discordInviteRegex, "");
};

exports.removeEveryonePing = (remove_everyone_ping, message) => {
	if (!remove_everyone_ping) return;

	// console.log(message.mentions.roles);

	// const everyoneRole = message.mentions.roles.find(
	// 	(r) => r.name === "everyone"
	// );

	// console.log(everyoneRole);

	// if (!everyoneRole) return;
	message.content = message.content.replaceAll(`@everyone`, "");
};

exports.removeChannels = (remove_channels, message) => {
	if (!remove_channels) return;

	message.mentions.channels.forEach(
		(c) => (message.content = message.content.replaceAll(`<#${c.id}>`, ""))
	);
};

exports.addReplyIfExists = async (message) => {
	if (!message.reference) return;

	const { reference, content } = message;

	const data = messageMap.findMessage(reference.messageId);

	if (!data) return;

	const [destChannelId, destMessageId] = data;

	const url = `**[Reply to message](<https://discord.com/channels/${SOURCE_GUILD_ID}/${destChannelId}/${destMessageId}>)**`;

	message.content = `${url}\n${content}`;
};

// const filterWordsRegex = new RegExp(
// 	`\\b(${Object.keys(filterWords).join("|")})\\b`,
// 	"gi"
// );

// function replaceSpoilers(message) {
// 	const spoilerPattern = /\|\|(.+?)\|\|/g;

// 	message.content = message.content.replace(spoilerPattern, "$1");
// }

// function nativeChannelMentionReplace(message) {
// 	const { channels } = message.mentions;
// 	if (channels.size === 0) return;

// 	channels.forEach((channel) => {
// 		message.content = message.content.replaceAll(
// 			`<#${channel.id}>`,
// 			`#${channel.name}`
// 		);
// 	});
// }

// const replaceChannelMentions = (message) => {
// 	const { client, content } = message;
// 	const discordLinkPattern =
// 		/https:\/\/discord\.com\/channels\/\d+\/\d+(?=\s|$)/g;

// 	// Use match method to find all matching links
// 	const matches = content.match(discordLinkPattern);

// 	console.log(matches);
// 	// Create a Set to store unique links
// 	const uniqueLinks = new Set(matches);

// 	// Convert the Set back to an array
// 	const arr = Array.from(uniqueLinks);

// 	for (const channelMention of arr) {
// 		const channel = client.channels.cache.get(channelMention.split("/").at(-1));

// 		if (!channel) continue;

// 		const exactChannelMentionPattern = new RegExp(
// 			`(${channelMention})(?=\\s|$)`,
// 			"g"
// 		);

// 		message.content = message.content.replaceAll(
// 			exactChannelMentionPattern,
// 			`#${channel.name}`
// 		);
// 	}

// 	nativeChannelMentionReplace(message);
// };

// const replaceMentions = async (message) => {
// 	const {
// 		mentions: { roles },
// 		client,
// 	} = message;

// 	const guild = client.guilds.cache.get(SOURCE_GUILD_ID);

// 	roles.forEach((element) => {
// 		const role = guild.roles.cache.find(
// 			(r) => r.name.toLowerCase() === element.name.toLowerCase()
// 		);

// 		if (role) message.content = message.content.replaceAll(element.id, role.id);
// 	});
// };

// const replaceFilterWords = (message) => {
// 	message.content = message.content.replace(
// 		filterWordsRegex,
// 		(match) => filterWords[match.toLowerCase()]
// 	);
// };

// const addMessageMapData = (message, id, starterContent) => {
// 	const data = messageMap.findMessage(id);

// 	const url = data
// 		? `[${starterContent}](<https://discord.com/channels/${SOURCE_GUILD_ID}/${data[0]}/${data[1]}>)`
// 		: starterContent;

// 	message.content = `**${url}**\n${message.content}`;
// };

// const addReplyIfExist = (message) => {
// 	const lines = message.content.split("\n");
// 	const firstLine = lines[0].trim();
// 	const pattern =
// 		/^\*\*\[(Reply to|Message edited to) (.*?):\]\(<(https:\/\/discord\.com\/channels\/.*?)>\)\*\*$/;

// 	const match = firstLine.match(pattern);
// 	if (!match) return;

// 	const textInsideBrackets = match[0].match(/\[(.*?)\]/)[1];
// 	const url = match[3];
// 	const messageId = url.split("/").pop();
// 	message.content = lines.slice(1).join("\n").trim();

// 	addMessageMapData(message, messageId, textInsideBrackets);
// };

// module.exports = {
// 	replaceMentions,
// 	replaceFilterWords,
// 	addReplyIfExist,
// 	replaceSpoilers,
// 	replaceChannelMentions,
// };
