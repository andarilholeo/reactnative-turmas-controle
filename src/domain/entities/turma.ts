export type Turno = 'morning' | 'afternoon' | 'evening';

export const TURNO_LABEL: Record<Turno, string> = {
  morning: 'Matutino',
  afternoon: 'Vespertino',
  evening: 'Noturno',
};

export interface Turma {
  id: string;
  schoolId: string;
  name: string;
  shift: Turno;
  academicYear: number;
  createdAt: string;
}

export type CreateTurmaDTO = Omit<Turma, 'id' | 'createdAt'>;
export type UpdateTurmaDTO = Partial<Omit<CreateTurmaDTO, 'schoolId'>>;
