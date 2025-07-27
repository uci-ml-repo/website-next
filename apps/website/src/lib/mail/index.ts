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
      FromEmailAddress: "no-reply@" + Resource.Email.sender,
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
      },
      Content: {
        Simple: {
          Subject: {
            Data: subject,
          },
          Body: {
            Text: text ? { Data: text } : undefined,
            Html: html ? { Data: html } : undefined,
          },
        },
      },
    }),
  );
}
