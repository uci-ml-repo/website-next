import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { Resource } from "sst";

export const client = new SESv2Client();

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}) {
  await client.send(
    new SendEmailCommand({
      FromEmailAddress: `UCI Machine Learning Repository <no-reply@${Resource.Email.sender}>`,
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
      },
      Content: {
        Simple: {
          Subject: {
            Data: subject,
          },
          Body: {
            Text: text ? { Data: text, Charset: "UTF-8" } : undefined,
            Html: html ? { Data: html, Charset: "UTF-8" } : undefined,
          },
        },
      },
    }),
  );
}
