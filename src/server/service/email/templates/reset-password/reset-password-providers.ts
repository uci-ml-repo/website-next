export function resetPasswordProviders({
  name,
  providers,
}: {
  name: string;
  providers: string[];
}) {
  return `Hello ${name},
  
We have received a requested to change your password. Our records show that you registered for the UCI Machine Learning Repository using the following providers:

${providers.map((provider) => `- ${provider}`).join("\n")}

To access your account, try logging in with a listed provider.

If you did not request a password change, you can ignore this message.
`;
}
