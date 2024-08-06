const { OpenAI } = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? 'No chatgpt api key provided',
});

async function useChatGptToConvertMessage(webhook, message) {
  if (!webhook.use_chatgpt_conversion) return message.content;

  const chatCompletion = await client.chat.completions.create({
    model: webhook.gpt_model,
    messages: [
      {
        role: "system",
        content: webhook.chatgpt_instruction,
      },
      {
        role: "user",
        content: message.content,
      },
    ],
  });

  return chatCompletion.choices[0].message.content;
}

module.exports = { useChatGptToConvertMessage };
