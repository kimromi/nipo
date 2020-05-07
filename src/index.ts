import dotenv from 'dotenv'
import { App } from '@slack/bolt'
dotenv.config()

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
})

app.command('/nipo', async ({ ack, body, context }) => {
  await ack()

  try {
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'nipo',
        private_metadata: JSON.stringify(body.channel_id),
        title: {
          type: 'plain_text',
          text: '日報'
        },
        blocks: [
          {
            type: 'input',
            block_id: 'today',
            label: {
              type: 'plain_text',
              text: '今日やったこと'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'input',
              multiline: true
            }
          },
          {
            type: 'input',
            block_id: 'tomorrow',
            label: {
              type: 'plain_text',
              text: '明日やること'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'input',
              multiline: true
            }
          },
          {
            type: 'input',
            block_id: 'share',
            label: {
              type: 'plain_text',
              text: '共有・相談事項'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'input',
              multiline: true
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit'
        }
      }
    })
    console.log(result)
  } catch (e) {
    console.error(e)
    app.error(e)
  }
})

app.view('nipo', async ({ ack, body, context, view }) => {
  await ack()

  const channelId = JSON.parse(view.private_metadata)

  try {
    const user: any = await app.client.users.profile.get({
      token: context.botToken,
      user: body.user.id
    })

    await app.client.chat.postMessage({
      token: context.botToken,
      channel: channelId,
      text: `<@${body.user.id}> さんの日報`,
      icon_url: user.profile.image_32,
      attachments: [
        {
          color: 'good',
          title: '今日やったこと',
          text: view.state.values.today.input.value
        },
        {
          color: 'good',
          title: '明日やること',
          text: view.state.values.tomorrow.input.value
        },
        {
          color: 'good',
          title: '共有・相談事項',
          text: view.state.values.share.input.value
        }
      ]
    })
  } catch (e) {
    console.error(e)
    app.error(e)
  }
});

(async () => {
  await app.start(process.env.PORT || 13000)

  console.log('⚡️ Bolt app is running!')
})()

export { app }
