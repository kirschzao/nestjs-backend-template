export abstract class SendEmailAdapter {
  abstract sendEmail2FA(email: string, code: string, name?: string): Promise<void>;
  abstract sendEmailResetPassword(email: string, code: string, name?: string): Promise<void>;
  abstract sendEmailPaswordChanged(email: string, name?: string): Promise<void>;
  abstract sendEmailWelcome(email: string, name?: string, password?: string): Promise<void>;
}
