import { Client, GatewayIntentBits, TextChannel, EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

// Discord client configuration
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

// Initialize Discord client
client.login(process.env.DISCORD_BOT_TOKEN);

// Wait for client to be ready
let clientReady = false;
client.once('ready', () => {
  console.log(`Discord bot logged in as ${client.user?.tag}`);
  clientReady = true;
});

// Wait for client to be ready before processing events
function waitForClientReady() {
  return new Promise<void>((resolve) => {
    if (clientReady) {
      resolve();
    } else {
      client.once('ready', () => {
        resolve();
      });
    }
  });
}

/**
 * Process GitHub event and send notification to Discord
 */
export async function processEvent(event: any) {
  try {
    await waitForClientReady();
    console.log('Processing event for Discord notification:', event.type);
    
    switch (event.type) {
      case 'pr_merged':
        await sendPrMergedNotification(event.payload);
        break;
      default:
        console.log(`Unhandled event type for Discord: ${event.type}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error processing Discord notification:', error);
    throw error;
  }
}

/**
 * Send notification about merged PR to Discord
 */
async function sendPrMergedNotification(payload: any) {
  const { pull_request, repository } = payload;
  const channelId = process.env.DISCORD_CHANNEL_ID;
  
  if (!channelId) {
    console.warn('No Discord channel ID configured for notification');
    return;
  }
  
  const channel = await client.channels.fetch(channelId);
  if (!channel || !(channel instanceof TextChannel)) {
    console.error(`Could not find text channel with ID ${channelId}`);
    return;
  }
  
  // Create rich embed for Discord
  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`PR #${pull_request.number} Merged: ${pull_request.title}`)
    .setURL(pull_request.html_url)
    .setAuthor({
      name: pull_request.merged_by.login,
      iconURL: pull_request.merged_by.avatar_url,
      url: pull_request.merged_by.html_url,
    })
    .setDescription(pull_request.body?.substring(0, 250) + '...' || 'No description provided')
    .addFields(
      { name: 'Repository', value: repository.full_name, inline: true },
      { name: 'Branch', value: pull_request.base.ref, inline: true },
      { name: 'Changes', value: `+${pull_request.additions} / -${pull_request.deletions}`, inline: true }
    )
    .setTimestamp(new Date(pull_request.merged_at))
    .setFooter({
      text: 'Codex MCP Hub',
      iconURL: 'https://avatars.githubusercontent.com/u/68508195', // OpenAI logo
    });
  
  // Send the embed to the channel
  await channel.send({ embeds: [embed] });
  console.log(`Sent Discord notification to channel ${channelId}`);
}

// Export the worker function for the main orchestrator
export default processEvent;