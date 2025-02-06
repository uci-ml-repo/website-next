export default function resetPassword({
  name,
  resetLink,
}: {
  name: string;
  resetLink: string;
}) {
  return `Hello ${name},
  
To reset your UCI Machine Learning Repository password, please follow this link:
${resetLink}

The link will expire in 5 minutes. If you did not request a password change, you can ignore this message and continue using your current password.`;
}
