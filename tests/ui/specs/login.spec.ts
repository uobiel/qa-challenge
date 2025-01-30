import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const CREDENCIAIS = {
    usuarioCorreto: "standard_user",
    senhaCorreta: "secret_sauce",
    usuarioInvalido: "invalid-user",
    senhaInvalida: "1234"
};

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle(/Swag Labs/);
});

test('Deve realizar login com sucesso', async ({page}) => {
    const loginPage = new LoginPage(page);
    loginPage.realizarLogin(CREDENCIAIS.usuarioCorreto, CREDENCIAIS.senhaCorreta);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('Deve exibir mensagem de erro ao tentar login com credênciais inválidas', async ({page}) => {
    const loginPage = new LoginPage(page);

    await loginPage.realizarLogin(CREDENCIAIS.usuarioInvalido, CREDENCIAIS.senhaInvalida);
    await loginPage.verificarMensagemErro('Epic sadface: Username and password do not match any user in this service');
});

test('Deve exibir mensagem de erro ao tentar login com senha inválida', async ({page}) => {
    const loginPage = new LoginPage(page);

    await loginPage.realizarLogin(CREDENCIAIS.usuarioCorreto, CREDENCIAIS.senhaInvalida);
    await loginPage.verificarMensagemErro('Epic sadface: Username and password do not match any user in this service');
});