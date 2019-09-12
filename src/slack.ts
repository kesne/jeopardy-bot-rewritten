import { RTMClient } from '@slack/rtm-api';

const SUPER_SECRET_TOKEN_DO_NOT_SHARE = 'Q3ByOVVOdFZjcGdOdEVDdU5UVjJZYkF1LTM4MzkyMDI0NDcxLWJ4b3g=';

function decodeToken(token: string) {
  return Buffer.from(token, 'base64')
    .toString('utf-8')
    .split('')
    .reverse()
    .join('');
}

// Initialize
const rtm = new RTMClient(decodeToken(SUPER_SECRET_TOKEN_DO_NOT_SHARE));

(async () => {
  // Connect to Slack
  const { self } = await rtm.start();

  console.log(`🎉  Connected to slack as "${(self as any).name}"`);
})();
