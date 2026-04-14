/**
 * Mock do Expo Winter Runtime para Jest.
 *
 * O Expo SDK 54+ usa `import.meta` (ESM) no módulo winter/runtime.native.ts
 * para implementar um registro de módulos dinâmico. Em Jest (modo CommonJS),
 * `import.meta` não existe e provoca um ReferenceError.
 *
 * Solução: substituímos o módulo por um objeto vazio via moduleNameMapper.
 * O comportamento real do winter runtime não é necessário em testes unitários.
 */
module.exports = {};
