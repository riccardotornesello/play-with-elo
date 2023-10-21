import Mailjet from 'node-mailjet';

import config from './config';

const mailjet = new Mailjet({
  apiKey: config.mailjet.apiKey,
  apiSecret: config.mailjet.apiSecret,
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  const result = await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'no-reply@playwithelo.com',
          Name: 'Play With Elo',
        },
        To: [
          {
            Email: to,
          },
        ],
        Subject: subject,
        TextPart: text,
        HTMLPart: html,
      },
    ],
  });

  return result;
}
