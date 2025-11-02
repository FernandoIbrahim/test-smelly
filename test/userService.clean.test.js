/* eslint-env jest */
const { UserService } = require('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Testes', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    // Permite uso apenas em ambiente de teste (evita no-underscore-dangle)
    // eslint-disable-next-line no-underscore-dangle
    userService._clearDB();
  });

  test('deve criar e buscar um usuário corretamente', () => {
    // Act 1: Criar
    const usuarioCriado = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    );

    expect(usuarioCriado).toHaveProperty('id');

    // Act 2: Buscar
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);
    expect(usuarioBuscado.nome).toBe(dadosUsuarioPadrao.nome);
    expect(usuarioBuscado.status).toBe('ativo');
  });

  test('deve desativar usuário comum (não administrador)', () => {
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);
    const resultado = userService.deactivateUser(usuarioComum.id);

    expect(resultado).toBe(true);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('não deve desativar usuário administrador', () => {
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);
    const resultado = userService.deactivateUser(usuarioAdmin.id);

    expect(resultado).toBe(false);
    const adminAtualizado = userService.getUserById(usuarioAdmin.id);
    // Opcional: assegura que o status não foi alterado indevidamente
    expect(adminAtualizado.status).toBe('ativo');
  });

  test('deve gerar um relatório de usuários formatado (contém linha esperada)', () => {
    const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
    userService.createUser('Bob', 'bob@email.com', 32);

    const relatorio = userService.generateUserReport();

    // Verificação pontual e robusta (evita quebra por mudanças mínimas)
    const linhaEsperada = `ID: ${usuario1.id}, Nome: Alice, Status: ativo`;
    expect(relatorio).toContain('--- Relatório de Usuários ---');
    expect(relatorio).toContain(linhaEsperada);
  });

  test('deve falhar ao criar usuário menor de idade', () => {
    expect(() =>
      userService.createUser('Menor', 'menor@email.com', 17)
    ).toThrow('O usuário deve ser maior de idade.');
  });

  test.todo('deve retornar uma lista vazia quando não há usuários');
});