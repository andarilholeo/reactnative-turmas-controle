import { Turma } from '@/src/domain/entities/turma';

export let turmas: Turma[] = [
  { id: '101', schoolId: '1', name: '1º Ano A', shift: 'morning', academicYear: 2025, createdAt: '2025-01-10T08:00:00.000Z' },
  { id: '102', schoolId: '1', name: '2º Ano B', shift: 'afternoon', academicYear: 2025, createdAt: '2025-01-10T08:00:00.000Z' },
  { id: '103', schoolId: '1', name: '3º Ano C', shift: 'evening', academicYear: 2025, createdAt: '2025-01-10T08:00:00.000Z' },
  { id: '201', schoolId: '2', name: '1º Ano A', shift: 'morning', academicYear: 2025, createdAt: '2025-01-11T08:00:00.000Z' },
  { id: '202', schoolId: '2', name: '2º Ano B', shift: 'afternoon', academicYear: 2025, createdAt: '2025-01-11T08:00:00.000Z' },
];

export function setTurmas(newTurmas: Turma[]) {
  turmas = newTurmas;
}