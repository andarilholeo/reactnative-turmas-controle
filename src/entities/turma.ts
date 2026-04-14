/**
 * Entidade: Turma (Class)
 *
 * Representa uma turma vinculada a uma escola.
 * Usamos o nome "Turma" para evitar conflito com a palavra reservada
 * "class" do JavaScript/TypeScript.
 */

/**
 * Turnos disponíveis para uma turma.
 *
 * Union type com valores literais — o TypeScript garante que apenas
 * esses três valores são aceitos, eliminando erros de digitação em runtime.
 */
export type Turno = 'morning' | 'afternoon' | 'evening';

/** Mapa de labels amigáveis para exibição na UI */
export const TURNO_LABEL: Record<Turno, string> = {
  morning: 'Matutino',
  afternoon: 'Vespertino',
  evening: 'Noturno',
};

export interface Turma {
  /** Identificador único */
  id: string;
  /** ID da escola à qual esta turma pertence (Foreign Key) */
  schoolId: string;
  /** Nome da turma, ex: "1º Ano A" */
  name: string;
  /** Turno em que a turma funciona */
  shift: Turno;
  /** Ano letivo, ex: 2025 */
  academicYear: number;
  /** Data de cadastro (ISO 8601) */
  createdAt: string;
}

/** DTO para criação de turma — sem id, schoolId e createdAt */
export type CreateTurmaDTO = Omit<Turma, 'id' | 'createdAt'>;

/** DTO para atualização parcial de turma */
export type UpdateTurmaDTO = Partial<Omit<CreateTurmaDTO, 'schoolId'>>;
