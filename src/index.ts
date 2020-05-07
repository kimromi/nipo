import dotenv from 'dotenv'
import { App } from '@slack/bolt'
dotenv.config()

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

(async () => {
  await app.start(process.env.PORT || 13000)

  console.log('⚡️ Bolt app is running!')
})()

export { app }
