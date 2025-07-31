import type { Options } from "@react-email/components";
import { Link, render, Text } from "@react-email/components";

import { EmailLayout } from "../layout";

interface Props {
  name: string;
  url: string;
}

export default function ResetPassword({ name, url }: Props) {
  return (
    <EmailLayout name={name}>
      <Text>Please click the following link to reset your password:</Text>
      <Text>
        <Link href={url}>{url}</Link>
      </Text>
      <Text>If you did not request to reset your password, please ignore this message.</Text>
    </EmailLayout>
  );
}

export const resetPassword = async (props: Props, options?: Options) =>
  await render(<ResetPassword {...props} />, options);
