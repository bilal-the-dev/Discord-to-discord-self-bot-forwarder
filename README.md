# Discord to Discord Forwarder using Webhooks (Self-Bot)

This repository contains a Discord self-bot written in Node.js that forwards messages from a source channel to a destination channel using webhooks. The user doesn't need to be an admin in the source server, just a member. ChatGpt integration as well, use AI to format and rephrase your messages and many more!

## Features

- Forward messages from a source Discord channel to a destination Discord channel.
- Forward replies aswell, target source has replied message. the webhook points to replied message on source.
- Uses webhooks for forwarding messages.
- Does not require admin privileges in the source server.
- Forward messages from a specific channel at a specific time in your timezone of choice say [FROM 9AM to 4PM EST time]
- Can use the name and picture of sender instead of default webhook profile (`use_user_profile`)
- Dont forward media (`no_media`)
- Remove emojis from message (`remove_emojis`)
- Use chat gpt to rephrase your messages with instructions (`chatgpt_instruction`, `gpt_model`,`chatgpt_instruction`)
- Removes Discord invite links if configured (`remove_discord_links`).
- Removes every sort of website links (https/http) if configured (`remove_web_links`).
- Only allows messages from specified senders (`allowed_senders`).
- Only allows messages containing specific words (`allowed_words`).
- Block messages containing specific words (`blocked_words`).
- Adds a header to the top of each message (`name`).
- Remove everyone ping from message (`remove_everyone_ping`)
- Remove `@Unknown-user` from the messages (`remove_unknown_users`)
- Remove `#Unknown` from the messages (`remove_channels`)
- Remove `@Unknown-role` from the messages (`remove_roles`)
- Add custom names for senders (`custom_names`)

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

Create a `.env` file in the root directory of the project and add your Discord user token.

```env
TOKEN=YOUR_USER_TOKEN_HERE
OPENAI_API_KEY=HERE
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
      "use_user_profile": true,
      "blocked_words": ["nephra", "kidney"],

      "remove_web_links": true,
      "allowed_senders": ["1234567788", "0987654321"],
      "allowed_words": ["looking for entry", "silver gold"],
      "remove_discord_links": true,
      "use_chatgpt_conversion": true,
      "gpt_model": "gpt-3.5-turbo",
      "chatgpt_instruction": "You are an esteemed stock, options, and equities trader. You KNOW all the ticker symbols on the NYSE and other major stock exchanges. Your task is to summarize messages in bullet points in your own words and analysis. Rewrite the reply in bullet points and not in whole sentences. Make it simple, concise, and to the point."
    },
    {
      "name": "News",
      "_comment": "ALT CHANNEL",
      "channel_id": "1170066899934130197",
      "webhook_url": "https://discord.com/api/webhooks/dummy/dummy",
      "allowed_senders": ["1234567788", "0987654321"],
      "remove_discord_links": true,
      "remove_everyone_ping": true,
      "remove_unknown_users": true,
      "remove_channels": true,
      "remove_roles": true,
      "remove_emojis": true,
      "no_media": true,
      "custom_names": {
        "620547628857425920": "Abraham Signals"
      },
      "forward_at_timezone": {
        "timezone": "America/New_York",
        "forwardAfterHour": 9,
        "forwardBeforeHour": 16
      }
    }
  ]
}
```

- `name` (optional): Adds a header to messages for this mirror.
- `_comment`: to set some notes
- `channel_id`: The ID of the source channel in your Discord server.
- `webhook_url`: The webhook URL for the destination channel.
- `forward_at_timezone`: Specify to mention the message be forwarded only if time is so and so
- `use_user_profile`: use the sender picture and name instead of webhook default picture/name
- `no_media`: strips off all sort of media before forwarding
- `remove_emojis`: strips off all sort of emojis before forwarding
- `use_chatgpt_conversion`: use the chat gpt AI to tranform your messages
- `gpt_model`: which model to use
- `chatgpt_instruction`: instructions that chat gpt will take and transform messages accordingly
- `allowed_senders` (optional): Array of Discord user IDs allowed to send messages through the self-bot.
- `allowed_words` (optional): Array of words allow messages to go through the self-bot.
- `blocked_words` (optional): Array of words block messages to not go through the self-bot.
- `remove_discord_links` (optional): Set to `true` to remove Discord invite links from messages.
- `remove_web_links` (optional): Set to `true` to remove every website link before bot checks for blocked, allowed words/users.
- `remove_everyone_ping` (optional): Set to `true` to remove everyone ping from messages.
- `remove_channels` (optional): Sometimes when message contain channel from source, the channel appear as #Unknown. Set this to `true` to remove them.
- `remove_unknown_users` (optional): Sometimes when message mentions users on source, the member appear as #Unknown. Set this to `true` to remove them.
- `remove_roles` (optional): Sometimes when message contain roles from source, the role appear as #Unknown-role. Set this to `true` to remove them.
- `remove_embed_title_footer` (optional): Remove title/footer of the embed if any.
- `custom_names` (optional): Lets say, John and Abraham are sending message on source. While you have set webhook name to `Forwarder` but you wanna distinguish on your server between John and Abraham. Set this property as object below.

```json
"custom_names":{
	"JOHN_DISCORD_ID":"John Announces",
	"ABRAHAM_DISCORD_ID":"Abraham Signals"
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
