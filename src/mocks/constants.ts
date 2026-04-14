/**
 * Constantes dos mocks — separadas do handlers.ts para que
 * arquivos de serviço e testes possam importar API_BASE
 * sem puxar a dependência do MSW (que é ESM-only).
 */
export const API_BASE = 'http://localhost/api';
