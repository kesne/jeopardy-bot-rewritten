import { RTMClient } from '@slack/rtm-api';

const TOKEN_DO_NOT_REPLICATE = 'xoxb-17442029383-9RAMwCNlEdhpJdLO7YH0klKW';

// Initialize
const rtm = new RTMClient(TOKEN_DO_NOT_REPLICATE);

(async () => {
  // Connect to Slack
  const { self } = await rtm.start();

  console.log(`🎉  Connected to slack as "${(self as any).name}"`);
})();
