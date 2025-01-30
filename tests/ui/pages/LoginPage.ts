import { expect, Page } from '@playwright/test';

export class LoginPage {
    private page: Page;
    private inputUsuario = '#user-name';
    private inputSenha = '#password';
    private botaoLogin = '#login-button';
    private mensagemErro = '[data-test="error"]';

    constructor(page: Page) {
        this.page = page;
    }

    async realizarLogin(usuario: string, senha: string) {
        await this.page.fill(this.inputUsuario, usuario);
        await this.page.fill(this.inputSenha, senha);
        await this.page.click(this.botaoLogin);
    }

    async verificarMensagemErro(mensagemEsperada: string) {
        const erroLocator = this.page.locator(this.mensagemErro);
        await erroLocator.isVisible();
        await expect(erroLocator).toHaveText(mensagemEsperada);
    }
}