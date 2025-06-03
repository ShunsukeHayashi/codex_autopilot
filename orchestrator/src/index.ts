import express from 'express';
import Redis from 'redis';
import { Webhooks } from '@octokit/webhooks';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

// Create Redis client for queue management
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Initialize Express app
const app = express();
app.use(express.json());

// Initialize GitHub Webhooks
const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET || 'development-secret',
});

// Initialize GitHub API client
const octokit = new Octokit({
  auth: process.env.GITHUB_APP_TOKEN,
});

// Queue names
const QUEUES = {
  GITHUB_EVENTS: 'gh-events',
  LINE: 'line',
  DISCORD: 'discord',
};

// Connect to Redis
(async () => {
  await redisClient.connect();
  console.log('Connected to Redis');
})();

// GitHub webhook handler
webhooks.on('issue_comment.created', async ({ payload }) => {
  if (payload.comment.body.startsWith('/codex')) {
    console.log(`Processing codex command: ${payload.comment.body}`);
    
    // Add to GitHub events queue
    await redisClient.lPush(QUEUES.GITHUB_EVENTS, JSON.stringify({
      type: 'issue_comment',
      payload,
    }));
  }
});

webhooks.on('pull_request.opened', async ({ payload }) => {
  console.log(`PR opened: ${payload.pull_request.title}`);
  
  // Add to GitHub events queue
  await redisClient.lPush(QUEUES.GITHUB_EVENTS, JSON.stringify({
    type: 'pull_request_opened',
    payload,
  }));
});

webhooks.on('pull_request.merged', async ({ payload }) => {
  if (payload.pull_request.merged) {
    console.log(`PR merged: ${payload.pull_request.title}`);
    
    // Add to both LINE and Discord queues for notifications
    await Promise.all([
      redisClient.lPush(QUEUES.LINE, JSON.stringify({
        type: 'pr_merged',
        payload,
      })),
      redisClient.lPush(QUEUES.DISCORD, JSON.stringify({
        type: 'pr_merged',
        payload,
      })),
    ]);
  }
});

// GitHub webhook endpoint
app.post('/webhook/github', (req, res) => {
  webhooks.verifyAndReceive({
    id: req.headers['x-github-delivery'] as string,
    name: req.headers['x-github-event'] as string,
    signature: req.headers['x-hub-signature-256'] as string,
    payload: req.body,
  }).then(() => {
    res.status(200).send('Webhook received');
  }).catch(err => {
    console.error('Error processing webhook:', err);
    res.status(500).send('Error processing webhook');
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Orchestrator server running on port ${PORT}`);
});

// Worker for processing GitHub events
async function processGitHubEvents() {
  while (true) {
    const result = await redisClient.blPop(QUEUES.GITHUB_EVENTS, 0);
    
    if (result && result.element) {
      const event = JSON.parse(result.element);
      console.log(`Processing GitHub event: ${event.type}`);
      
      try {
        // Process event based on type
        switch (event.type) {
          case 'issue_comment':
            // Handle issue comment
            break;
          case 'pull_request_opened':
            // Handle PR opened
            break;
          default:
            console.log(`Unhandled event type: ${event.type}`);
        }
      } catch (error) {
        console.error('Error processing event:', error);
        // Add to dead letter queue
        await redisClient.lPush(`${QUEUES.GITHUB_EVENTS}:dead`, result.element);
      }
    }
  }
}

// Worker for processing LINE notifications
async function processLineNotifications() {
  while (true) {
    const result = await redisClient.blPop(QUEUES.LINE, 0);
    
    if (result && result.element) {
      const event = JSON.parse(result.element);
      console.log(`Processing LINE notification: ${event.type}`);
      
      try {
        // Implement LINE notification logic here
        // This will be filled in when we implement the LINE service
      } catch (error) {
        console.error('Error processing LINE notification:', error);
        // Add to dead letter queue
        await redisClient.lPush(`${QUEUES.LINE}:dead`, result.element);
      }
    }
  }
}

// Worker for processing Discord notifications
async function processDiscordNotifications() {
  while (true) {
    const result = await redisClient.blPop(QUEUES.DISCORD, 0);
    
    if (result && result.element) {
      const event = JSON.parse(result.element);
      console.log(`Processing Discord notification: ${event.type}`);
      
      try {
        // Implement Discord notification logic here
        // This will be filled in when we implement the Discord service
      } catch (error) {
        console.error('Error processing Discord notification:', error);
        // Add to dead letter queue
        await redisClient.lPush(`${QUEUES.DISCORD}:dead`, result.element);
      }
    }
  }
}

// Start workers
processGitHubEvents().catch(err => console.error('GitHub worker error:', err));
processLineNotifications().catch(err => console.error('LINE worker error:', err));
processDiscordNotifications().catch(err => console.error('Discord worker error:', err));

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Closing HTTP server and Redis connection');
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received. Closing HTTP server and Redis connection');
  await redisClient.quit();
  process.exit(0);
});