/*
  elevenlabs-config.ts
  This configuration file exports the ElevenLabs credentials from environment variables.
  Make sure to add your credentials into the .env file at the root of your project.
*/

const agentId = process.env.ELEVENLABS_AGENT_ID ?? process.env.AGENT_ID ?? ''
const apiKey = process.env.ELEVENLABS_API_KEY ?? process.env.XI_API_KEY ?? ''

export const elevenLabsConfig = {
  agentId,
  apiKey,
}
