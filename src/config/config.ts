interface Config {
  API_URL: string;
  RESOURCES_URL: string;
  PLAUSIBLE_URL: string;
  DISCORD_CLIENT_ID: string;
}

export const config: Config = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  RESOURCES_URL: process.env.NEXT_PUBLIC_RESOURCES_URL || 'http://localhost:3000/resources',
  PLAUSIBLE_URL: process.env.NEXT_PUBLIC_PLAUSIBLE_URL || '',
  DISCORD_CLIENT_ID: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '',
}; 