import Main from "@/components/layout/Main";
import RegistrationTemplate from "@/server/service/email/templates/registration/RegistrationTemplate";

export default function Test() {
  return (
    <Main>
      <RegistrationTemplate name="Andrew" />
    </Main>
  );
}
