class HomePage {
  private get tabHome() {
    return $('~Home');
  }

  private get tabLogin() {
    return $('~Login');
  }

  async waitForHomeTab() {
    await this.tabHome.waitForDisplayed({ timeout: 15000 });
  }

  async isHomeTabDisplayed() {
    return await this.tabHome.isDisplayed();
  }

  async navigateToLogin() {
    await this.tabLogin.click();
  }
}

export default new HomePage();
