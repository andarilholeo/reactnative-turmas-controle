/**
 * Entidade: School (Escola)
 *
 * Representa uma escola pública no sistema.
 * Usamos `interface` ao invés de `type` para entidades de domínio porque:
 *  - Interfaces são extensíveis (é possível usar `extends`)
 *  - Expressam melhor o conceito de "formato de um objeto"
 */
export interface School {
  /** Identificador único (UUID gerado pelo serviço) */
  id: string;
  /** Nome completo da escola */
  name: string;
  /** Endereço completo da escola */
  address: string;
  /** Data de cadastro no sistema (ISO 8601) */
  createdAt: string;
}

/**
 * DTO (Data Transfer Object) para criação de escola.
 *
 * `Omit<School, 'id' | 'createdAt'>` é um Utility Type do TypeScript que
 * remove os campos 'id' e 'createdAt' da interface School. Isso garante
 * que ao criar uma escola o usuário não precise informar esses campos —
 * o serviço os gera automaticamente.
 */
export type CreateSchoolDTO = Omit<School, 'id' | 'createdAt'>;

/**
 * DTO para atualização parcial de escola.
 *
 * `Partial<T>` torna todos os campos opcionais, permitindo atualizar
 * apenas os campos desejados (PATCH semântico).
 */
export type UpdateSchoolDTO = Partial<CreateSchoolDTO>;
