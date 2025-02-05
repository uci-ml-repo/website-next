import { render } from "@react-email/render";

import RegistrationTemplate from "@/server/service/email/templates/registration/RegistrationTemplate";

export default class EmailTemplateService {
  async registration(name: string) {
    return render(<RegistrationTemplate name={name} />);
  }

  async passwordReset() {
    return null;
  }

  async emailVerification() {
    return null;
  }
}
