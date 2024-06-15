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

Create the `config.json` file with the source guild ID, source channel ID, and webhook URL for the destination channel. You can add as many mirrors you want (:

```json
{
	"status": "invisible",
	"SOURCE_GUILD_ID": "1247958702628278332",
	"mirrors": [
		{
			"_comment": "Balanced (info-main channel)",
			"channel_id": "1170066899934130197",
			"webhook_url": "https://discord.com/api/webhooks/dummy/dummy"
		}
	]
}
```

### 5. Run the bot

```sh
npm start
```

## Important Notes

- This script uses a self-bot, which is against Discord's Terms of Service. Use it at your own risk.
- Ensure the account has read message permissions in the source channel.
- The webhook URL should be kept private to prevent misuse.
