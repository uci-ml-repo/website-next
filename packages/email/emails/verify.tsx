import type { Options } from "@react-email/components";
import { Link, render, Text } from "@react-email/components";

import { EmailLayout } from "../layout";

interface Props {
  name: string;
  url: string;
}

export default function VerifyEmail({ name, url }: Props) {
  return (
    <EmailLayout name={name}>
      <Text>Please click the following link to verify your email address:</Text>
      <Text>
        <Link href={url}>{url}</Link>
      </Text>
      <Text>If you did not request to verify your email, please ignore this message.</Text>
    </EmailLayout>
  );
}

export const verifyEmail = async (props: Props, options?: Options) =>
  await render(<VerifyEmail {...props} />, options);
