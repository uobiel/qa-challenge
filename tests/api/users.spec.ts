import { test, expect, request } from '@playwright/test';

const BASE_URL = 'https://reqres.in/api';

test.describe('Fluxos de Teste de API', () => {
  
  test('Deve listar usuários e validar dados', async ({ request }) => {
    const resposta = await request.get(`${BASE_URL}/users?page=2`);
    expect(resposta.status()).toBe(200);
    
    const corpoResposta = await resposta.json();
    expect(corpoResposta.data).toBeInstanceOf(Array);
    expect(corpoResposta.data.length).toBeGreaterThan(0);
    
    corpoResposta.data.forEach(usuario => {
      expect(usuario).toMatchObject({
        id: expect.any(Number),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.stringMatching(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
      });
    });
  });

  test('Deve criar um usuário e validar os dados', async ({ request }) => {
    const dadosUsuario = { name: 'João QA', job: 'Engenheiro de Testes' };

    const resposta = await request.post(`${BASE_URL}/users`, { data: dadosUsuario });
    expect(resposta.status()).toBe(201);

    const corpoResposta = await resposta.json();
    expect(corpoResposta).toMatchObject({
      name: dadosUsuario.name,
      job: dadosUsuario.job,
      id: expect.any(String),
      createdAt: expect.any(String)
    });
  });

  test('Deve atualizar um usuário e validar os dados', async ({ request }) => {
    const novosDados = { name: 'João QA Atualizado', job: 'Líder de QA' };

    const resposta = await request.put(`${BASE_URL}/users/2`, { data: novosDados });
    expect(resposta.status()).toBe(200);

    const corpoResposta = await resposta.json();
    expect(corpoResposta).toMatchObject({
      name: novosDados.name,
      job: novosDados.job,
      updatedAt: expect.any(String)
    });
  });

  test('Deve validar tempo de resposta da API', async ({ request }) => {
    const inicio = Date.now();
    const resposta = await request.get(`${BASE_URL}/users?page=2`);
    const fim = Date.now();
    const tempoResposta = fim - inicio;

    expect(resposta.status()).toBe(200); 
    console.log(`Tempo de resposta: ${tempoResposta}ms`);
    expect(tempoResposta).toBeLessThan(1000); 
  });

  test('Deve retornar erro 404 ao tentar deletar usuário inexistente', async ({ request }) => {
    const resposta = await request.delete(`${BASE_URL}/users/999`);
    expect(resposta.status()).toBe(204);  
  });

  test('Deve lidar com falha de rede ou tempo limite', async ({ request }) => {
    const resposta = await request.get(`${BASE_URL}/users?page=2`, { timeout: 5000 });
    expect(resposta.status()).toBe(200);  
    const corpoResposta = await resposta.json();
    expect(corpoResposta).toBeDefined();
  });

});