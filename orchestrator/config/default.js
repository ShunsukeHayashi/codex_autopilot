module.exports = {
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    options: {
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
    },
  },
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
  },
  github: {
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
    appToken: process.env.GITHUB_APP_TOKEN,
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_PRIVATE_KEY,
  },
  workers: {
    concurrency: {
      github: 5,
      line: 3,
      discord: 3,
    },
    retryLimit: 3,
    retryDelay: 1000, // ms
  },
  notification: {
    line: {
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET,
    },
    discord: {
      token: process.env.DISCORD_BOT_TOKEN,
      clientId: process.env.DISCORD_CLIENT_ID,
      guildId: process.env.DISCORD_GUILD_ID,
      channelId: process.env.DISCORD_CHANNEL_ID,
    },
  },
};