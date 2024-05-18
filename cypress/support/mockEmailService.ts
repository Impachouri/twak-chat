import sinon from "sinon";
import * as emailService from "../../src/utils/emailService";

export const mockEmailService = () => {
  const sendEmailNotificationStub = sinon
    .stub(emailService, "sendEmailNotification")
    .resolves();
  return { sendEmailNotificationStub };
};
