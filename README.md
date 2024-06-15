# Discord to Discord Forwarder using Webhooks (Self-Bot)

This repository contains a Discord self-bot written in Node.js that forwards messages from a source channel to a destination channel using webhooks. The user doesn't need to be an admin in the source server, just a member.

## Features

- Forward messages from a source Discord channel to a destination Discord channel.
- Uses webhooks for forwarding messages.
- Does not require admin privileges in the source server.

## Prerequisites

- Node.js 16 or higher.
- A Discord User token.
- Webhook URLs for the destination channel.

## Setup

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/discord-forwarder.git
cd discord-forwarder
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure the bot

Create a `.env` file in the root directory of the project and add your Discord bot token.

```env
TOKEN=YOUR_DISCORD_BOT_TOKEN_HERE
```

### 4. Edit the configuration file

Update the `config.json` file with the appropriate source guild ID, source channel ID, and webhook URL for the destination channel.

```json
{
	"status": "invisible",
	"SOURCE_GUILD_ID": "1247958702628278332",
	"mirrors": [
		{
			"_comment": "Balanced (info-main channel)",
			"channel_id": "1170066899934130197",
			"webhook_url": "https://discord.com/api/webhooks/1251161532121878591/05w4GfE_jC_ESTH29zhQkKSb9pdyUXvsq7U36nYGRuo147F7Z2FYL4GbIiOYd7rAkjVR"
		}
	]
}
```

### 5. Run the bot

```sh
node forwarder.js
```

## forwarder.js

```javascript
const { Client, Intents } = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");
require("dotenv").config();

// Load the bot token from .env file
const TOKEN = process.env.TOKEN;

// Load the config file
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag}`);
	client.user.setStatus(config.status);
});

client.on("messageCreate", async (message) => {
	// Ignore messages from the bot itself
	if (message.author.id === client.user.id) return;

	// Check if the message is from the source guild
	if (message.guild && message.guild.id === config.SOURCE_GUILD_ID) {
		for (let mirror of config.mirrors) {
			if (message.channel.id === mirror.channel_id) {
				// Forward the message using webhook
				const webhookUrl = mirror.webhook_url;
				const data = {
					content: message.content,
					username: message.author.username,
					avatar_url: message.author.displayAvatarURL(),
				};
				try {
					const response = await fetch(webhookUrl, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data),
					});
					if (!response.ok) {
						console.error(
							`Failed to send message: ${response.status} ${response.statusText}`
						);
					}
				} catch (error) {
					console.error(`Error sending message: ${error}`);
				}
			}
		}
	}
});

client.login(TOKEN);
```

## Important Notes

- This script uses a self-bot, which is against Discord's Terms of Service. Use it at your own risk.
- Ensure the bot has read message permissions in the source channel.
- The webhook URL should be kept private to prevent misuse.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Acknowledgments

- [discord.js](https://github.com/discordjs/discord.js) - A powerful JavaScript library for interacting with the Discord API.
- [dotenv](https://github.com/motdotla/dotenv) - Loads environment variables from a .env file into `process.env`.
