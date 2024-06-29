# Discord to Discord Forwarder using Webhooks (Self-Bot)

This repository contains a Discord self-bot written in Node.js that forwards messages from a source channel to a destination channel using webhooks. The user doesn't need to be an admin in the source server, just a member.

## Features

- Forward messages from a source Discord channel to a destination Discord channel.
- Forward replies aswell, target source has replied message. the webhook points to replied message on source.
- Uses webhooks for forwarding messages.
- Does not require admin privileges in the source server.
- Removes Discord invite links if configured (`remove_discord_links`).
- Only allows messages from specified senders (`allowed_senders`).
- Only allows messages containing specific words (`allowed_words`).
- Adds a custom name prefix to messages (`name`).

## Prerequisites

- Node.js 16 or higher.
- A Discord User token.
- Webhook URLs for the destination channel.

## Setup

### 1. Clone the repository

```sh
git clone https://github.com/bilal-the-dev/Discord-to-discord-self-bot-forwarder.git discord-forwarder
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

Create or edit the `config.json` file with the following structure:

```json
{
	"status": "invisible",
	"SOURCE_GUILD_ID": "1247958702628278332",
	"mirrors": [
		{
			"name": "Balanced (info-main channel)",
			"_comment": "MAIN CHANNEL",
			"channel_id": "1170066899934130197",
			"webhook_url": "https://discord.com/api/webhooks/dummy/dummy",
			"allowed_senders": ["1234567788", "0987654321"],
			"allowed_words": ["looking for entry", "silver gold"],
			"remove_discord_links": true
		},
		{
			"name": "News",
			"_comment": "ALT CHANNEL",
			"channel_id": "1170066899934130197",
			"webhook_url": "https://discord.com/api/webhooks/dummy/dummy",
			"allowed_senders": ["1234567788", "0987654321"],
			"remove_discord_links": true
		}
	]
}
```

- `name` (optional): Adds a custom name prefix to messages from this mirror.
- `_comment`: to set some notes
- `channel_id`: The ID of the source channel in your Discord server.
- `webhook_url`: The webhook URL for the destination channel.
- `allowed_senders` (optional): Array of Discord user IDs allowed to send messages through the self-bot.
- `allowed_words` (optional): Array of words allow messages to go through the self-bot.
- `remove_discord_links` (optional): Set to `true` to remove Discord invite links from messages.

### 5. Run the bot

```sh
npm start
```

## Important Notes

- This script uses a self-bot, which is against Discord's Terms of Service. Use it at your own risk.
- Ensure the account has read message permissions in the source channel.
- The webhook URL should be kept private to prevent misuse.

```

### Explanation:

- **Features Section**: Lists the new functionalities (`remove_discord_links`, `allowed_senders`, `name`) along with the existing features.
- **Setup Section**: Provides an example configuration (`config.json`) demonstrating how to set up mirrors with the new features.
- **Important Notes**: Reminds users about the risks associated with using a self-bot and emphasizes the importance of maintaining privacy of webhook URLs.
```
