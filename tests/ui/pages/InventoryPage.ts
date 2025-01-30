import { expect, Page } from '@playwright/test';

export class InventoryPage {
    private page: Page;

    private carrinho = '.shopping_cart_link';
    private contadorCarrinho = '.shopping_cart_badge';
    private cartLocator = '.cart_item';
    private checkout = '#checkout';
    private continue = '#continue';
    private firstName = '[data-test="firstName"]';
    private lastName = '[data-test="lastName"]';
    private postalCode = '[data-test="postalCode"]';
    private mensagemErro = '[data-test="error"]';

    constructor(page: Page) {
        this.page = page;
    }

    async adicionarProdutoAoCarrinho(produto: string) {
        await this.page.locator(`button[data-test="add-to-cart-${produto}"]`).click();
    }

    async removerProdutoDoCarrinho(produto: string) {
        await this.page.locator(`button[data-test="remove-${produto}"]`).click();
    }

    async acessarCarrinho() {
        await this.page.click(this.carrinho);
    }

    async verificarContadorCarrinho(quantidade: string) {
        await expect(this.page.locator(this.contadorCarrinho)).toHaveText(quantidade);
    }

    async validarProdutoAdicionado(produto: string) {
        const cartLocator = this.page.locator(`${this.cartLocator}:has-text("${produto}")`); 
        await expect(cartLocator).toBeVisible();
    }

    async validarProdutoRemovido(produto: string) {
        const cartLocator = this.page.locator(`${this.cartLocator}:has-text("${produto}")`); 
        await expect(cartLocator).toHaveCount(0);
    }

    async clicarCheckout() {
        await this.page.locator(this.checkout).click();
    }

    async preencherCheckout(first?: string, last?: string, zip?: string) {
        if (first) await this.page.fill(this.firstName, first);
        if (last) await this.page.fill(this.lastName, last);
        if (zip) await this.page.fill(this.postalCode, zip);
    }

    async clicarContinue() {
        await this.page.locator(this.continue).click();
    }

    async verificarMensagemErro(mensagemEsperada: string) {
        const erroLocator = this.page.locator(this.mensagemErro);
        await erroLocator.isVisible();
        await expect(erroLocator).toHaveText(mensagemEsperada);
    }
}