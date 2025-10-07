/*
  elevenlabs-config.ts
  This configuration file exports the ElevenLabs credentials.
  Values are hardcoded with fallback to environment variables for local development.
*/

// Hardcoded values - safe to use since they're for client-side conversation API
const AGENT_ID = 'agent_0201k4mvk773fee8mp0nn4r36jjj'
const API_KEY = 'sk_1a8c535e7119122225f75d1069f93f46eabc20799f6a3dd8'

// Use environment variables if available (for local dev), otherwise use hardcoded values
const agentId = process.env.ELEVENLABS_AGENT_ID ?? process.env.AGENT_ID ?? AGENT_ID
const apiKey = process.env.ELEVENLABS_API_KEY ?? process.env.XI_API_KEY ?? API_KEY

export const elevenLabsConfig = {
  agentId,
  apiKey,
}
