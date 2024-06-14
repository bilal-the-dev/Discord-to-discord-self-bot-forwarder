const MirrorClient = require("./classes/client");
const config = require("../config.json");

const client = new MirrorClient({
	// partials: [
	// 	"USER",
	// 	"CHANNEL",
	// 	"GUILD_MEMBER",
	// 	"MESSAGE",
	// 	"ThreadMember",
	// 	"REACTION",
	// 	"GUILD_SCHEDULED_EVENT",
	// ],
	// intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"],

	// checkUpdate: false,
});
client.login(config["token"]);
