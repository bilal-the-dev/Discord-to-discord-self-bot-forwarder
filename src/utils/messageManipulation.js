const messageMap = require("./../cache/messageMap");

const { SOURCE_GUILD_ID, filterWords } = require("../../config.json");

const filterWordsRegex = new RegExp(
	`\\b(${Object.keys(filterWords).join("|")})\\b`,
	"gi"
);

function replaceSpoilers(message) {
	const spoilerPattern = /\|\|(.+?)\|\|/g;

	message.content = message.content.replace(spoilerPattern, "$1");
}
const replaceMentions = async (message) => {
	const {
		mentions: { roles },
		client,
	} = message;

	const guild = client.guilds.cache.get(SOURCE_GUILD_ID);

	console.log(guild.name);
	console.log(message.content);

	roles.forEach((element) => {
		const role = guild.roles.cache.find(
			(r) => r.name.toLowerCase() === element.name.toLowerCase()
		);

		console.log(role.name);

		if (role) message.content = message.content.replaceAll(element.id, role.id);
	});

	console.log(message.content);
};

const replaceFilterWords = (content) =>
	content.replace(
		filterWordsRegex,
		(match) => filterWords[match.toLowerCase()]
	);

const addMessageMapData = (message, id, starterContent) => {
	const data = messageMap.findMessage(id);

	const url = data
		? `[${starterContent}](<https://discord.com/channels/${SOURCE_GUILD_ID}/${data[0]}/${data[1]}>)`
		: starterContent;

	message.content = `**${url}**\n${message.content}`;
};

const addReplyIfExist = (message) => {
	const lines = message.content.split("\n");
	const firstLine = lines[0].trim();
	const pattern =
		/^\*\*\[(Reply to|Message edited to) (.*?):\]\(<(https:\/\/discord\.com\/channels\/.*?)>\)\*\*$/;

	const match = firstLine.match(pattern);
	if (!match) return;

	const textInsideBrackets = match[0].match(/\[(.*?)\]/)[1];
	const url = match[3];
	const messageId = url.split("/").pop();
	message.content = lines.slice(1).join("\n").trim();

	// console.log(messageId);
	// console.log(url);
	// console.log(textInsideBrackets);

	addMessageMapData(message, messageId, textInsideBrackets);
};

const addEditIfExist = (message) => {
	addMessageMapData(message, message.id, "Message Edited at:");
};
module.exports = {
	replaceMentions,
	replaceFilterWords,
	addReplyIfExist,
	addEditIfExist,
	replaceSpoilers,
};
