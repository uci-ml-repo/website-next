export default function verificationEmail({
  name,
  verificationLink,
}: {
  name: string;
  verificationLink: string;
}) {
  return `Hello ${name},
  
Please click the following link to verify your email address:

${verificationLink}

This link will expire in 5 minutes. If you did not request to verify your email, you can ignore this message.`;
}
