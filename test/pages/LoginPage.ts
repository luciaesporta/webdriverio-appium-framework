class LoginPage {
  private get inputEmail() {
    return $('~input-email');
  }

  private get inputPassword() {
    return $('~input-password');
  }

  async waitForEmailInput() {
    await this.inputEmail.waitForDisplayed({ timeout: 10000 });
  }

  async isEmailInputDisplayed() {
    return await this.inputEmail.isDisplayed();
  }

  async isPasswordInputDisplayed() {
    return await this.inputPassword.isDisplayed();
  }
}

export default new LoginPage();
