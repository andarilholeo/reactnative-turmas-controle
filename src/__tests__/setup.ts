/**
 * Jest global setup — executado antes de cada arquivo de teste.
 *
 * ── Fix: Expo Winter Runtime ───────────────────────────────────────────────
 * O Expo SDK 54 instala um getter lazy para `__ExpoImportMetaRegistry` via
 * `expo/src/winter/installGlobal.ts`. Quando acionado em Jest (modo CommonJS),
 * ele tenta carregar `runtime.native.ts` que usa `import.meta` — inexistente
 * em CommonJS — e lança "You are trying to `import` a file outside of scope".
 *
 * Solução: como o getter é `configurable: true`, sobrescrevemos aqui
 * (setupFilesAfterEnv roda APÓS o setupFiles do jest-expo) com um objeto
 * vazio seguro, impedindo que o getter problemático seja acionado.
 *
 * ── MSW e testes unitários ─────────────────────────────────────────────────
 * O MSW v2 usa pacotes ESM-only (rettime) incompatíveis com Jest/CommonJS.
 * Para testes UNITÁRIOS mockamos diretamente: fetch() e os repositórios.
 * O MSW continua ativo no app em dev (src/mocks/server.ts).
 */

/**
 * Fix Expo SDK 54 Winter Runtime — getters lazy problemáticos em Jest.
 *
 * O Expo SDK 54 instala lazy getters para vários globals via `installGlobal()`.
 * Quando acessados em Jest (CommonJS), eles carregam módulos ESM-only que falham.
 *
 * Solução segura:
 *   `Object.getOwnPropertyDescriptor` lê o descriptor SEM disparar o getter.
 *   Se o descriptor tem `.get` (é um getter lazy), sobrescrevemos com um valor seguro.
 *   O getter é `configurable: true` (linha 62 de installGlobal.ts), então podemos
 *   usar `Object.defineProperty` para substituí-lo.
 */
function patchLazyGlobal(name: string, safeValue: unknown) {
  const descriptor = Object.getOwnPropertyDescriptor(global, name);
  // Só substitui se for um getter lazy (descriptor.get existente)
  if (descriptor?.get) {
    Object.defineProperty(global, name, {
      value: safeValue,
      writable: true,
      configurable: true,
      enumerable: descriptor.enumerable ?? false,
    });
  }
}

// __ExpoImportMetaRegistry → objeto vazio (módulo de registro de imports)
patchLazyGlobal('__ExpoImportMetaRegistry', {});

// structuredClone → polyfill leve (Node 17+ tem nativo, mas o getter do Expo
// tenta carregar @ungap/structured-clone que é ESM-only)
patchLazyGlobal('structuredClone', <T>(obj: T): T => JSON.parse(JSON.stringify(obj)));

// Limpa todos os mocks após cada teste para evitar contaminação entre suítes
afterEach(() => jest.clearAllMocks());

