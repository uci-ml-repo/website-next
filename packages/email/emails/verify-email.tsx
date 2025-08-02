import type { Options } from "@react-email/components";
import { render, Text } from "@react-email/components";

import { EmailLayout } from "../layout";

interface Props {
  otp: string;
}

export default function VerifyEmail({ otp }: Props) {
  return (
    <EmailLayout>
      <Text>Your One Time Passcode for email verification is:</Text>
      <div className="w-fit bg-white">
        <Text className="px-4 py-2 text-2xl font-bold">{otp}</Text>
      </div>
      <Text>This passcode will expire in 5 minutes.</Text>
      <Text>If you did not request to verify your email, you can ignore this message.</Text>
    </EmailLayout>
  );
}

export const verifyEmail = async (props: Props, options?: Options) =>
  await render(<VerifyEmail {...props} />, options);
