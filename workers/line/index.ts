import { Client as LineClient } from '@line/bot-sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// LINE Bot configuration
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
};

// Initialize LINE Bot client
const lineClient = new LineClient(config);

// Template for PR merged notification
const PR_MERGED_TEMPLATE = fs.readFileSync(
  path.join(__dirname, 'templates', 'pr_merged.txt'),
  'utf8'
);

/**
 * Process GitHub event and send notification to LINE
 */
export async function processEvent(event: any) {
  try {
    console.log('Processing event for LINE notification:', event.type);
    
    switch (event.type) {
      case 'pr_merged':
        await sendPrMergedNotification(event.payload);
        break;
      default:
        console.log(`Unhandled event type for LINE: ${event.type}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error processing LINE notification:', error);
    throw error;
  }
}

/**
 * Send notification about merged PR
 */
async function sendPrMergedNotification(payload: any) {
  const { pull_request, repository } = payload;
  
  // Format PR merged message using template
  const message = PR_MERGED_TEMPLATE
    .replace('{{PR_TITLE}}', pull_request.title)
    .replace('{{PR_NUMBER}}', pull_request.number)
    .replace('{{PR_URL}}', pull_request.html_url)
    .replace('{{REPO_NAME}}', repository.full_name)
    .replace('{{MERGED_BY}}', pull_request.merged_by.login)
    .replace('{{MERGE_TIME}}', new Date(pull_request.merged_at).toLocaleString());
  
  // Get all user IDs to notify (from env var or config)
  const userIds = (process.env.LINE_USER_IDS || '').split(',').filter(Boolean);
  
  if (userIds.length === 0) {
    console.warn('No LINE user IDs configured for notification');
    return;
  }
  
  // Send message to each user
  const promises = userIds.map(userId => 
    lineClient.pushMessage(userId, {
      type: 'text',
      text: message,
    })
  );
  
  await Promise.all(promises);
  console.log(`Sent LINE notification to ${userIds.length} users`);
}

// Export the worker function for the main orchestrator
export default processEvent;