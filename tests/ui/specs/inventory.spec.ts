import test, { expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";

const produtos = [
    { nome: "Sauce Labs Backpack", id: "sauce-labs-backpack" },
    { nome: "Sauce Labs Onesie", id: "sauce-labs-onesie" },
    { nome: "Sauce Labs Fleece Jacket", id: "sauce-labs-fleece-jacket" },
];

test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle(/Swag Labs/);
    await login.realizarLogin('standard_user', 'secret_sauce')
});

test('Adicionar e remover produtos ao carrinho', async ({ page }) => {
    const inventory = new InventoryPage(page);
    // iterando sobre os produtos e adicionando eles ao carrinho
    for (let produto of produtos) {
        await inventory.adicionarProdutoAoCarrinho(produto.id);
    }

    // acessando o carrinho
    await inventory.acessarCarrinho();

    // iterando sobre os produtos e validando se eles foram adicionados ao carrinho
    for (let produto of produtos) {
        await inventory.validarProdutoAdicionado(produto.nome);
    }

    // verificando se o contador do carrinho é igual a 3
    await inventory.verificarContadorCarrinho('3');

    // iterando sobre os produtos para os remover do carrinho (apenas os dois primeiros)
    for (let i = 0; i < 2; i++) {
        await inventory.removerProdutoDoCarrinho(produtos[i].id);
    }

    // validando se os produtos realmente foram removidos do carrinho
    await inventory.validarProdutoRemovido(produtos[0].nome);
    await inventory.validarProdutoRemovido(produtos[1].nome);

    // validando se o produto que não foi removido permanece no carrinho
    await inventory.validarProdutoAdicionado(produtos[2].nome);

    // verificando se o contador do carrinho é igual a 1
    await inventory.verificarContadorCarrinho('1');
})

test('Finalizar compra sem preencher os dados obrigatórios', async ({ page }) => {
    const inventory = new InventoryPage(page);

    const pessoa = {
        nome: 'Marcos Joaquim',
        sobrenome: 'Ribeiro'
    }

    const erros = {
        obrigacaoPrimeiroNome: 'Error: First Name is required',
        obrigacaoSobrenome: 'Error: Last Name is required',
        obrigacaoCaixaPostal: 'Error: Postal Code is required'
    }

    // iterando sobre os produtos e adicionando eles ao carrinho
    for (let produto of produtos) {
        await inventory.adicionarProdutoAoCarrinho(produto.id);
    }

    // Acessando o carrinho
    await inventory.acessarCarrinho();

    // acessando o checkout e tentando avançar sem preencher nenhum campo
    await inventory.clicarCheckout();
    await inventory.clicarContinue();

    // validando mensagem de erro obrigando o preenchimento do nome
    await inventory.verificarMensagemErro(erros.obrigacaoPrimeiroNome);

    // preenchendo o nome
    await inventory.preencherCheckout(pessoa.nome);
    await inventory.clicarContinue();

    // validando mensagem de erro obrigando o preenchimento do sobrenome
    await inventory.verificarMensagemErro(erros.obrigacaoSobrenome);

    // preenchendo o nome e o sobrenome
    await inventory.preencherCheckout(pessoa.nome, pessoa.sobrenome);
    await inventory.clicarContinue();

    // validando mensagem de erro obrigando o preenchimento do código postal
    await inventory.verificarMensagemErro(erros.obrigacaoCaixaPostal);
})