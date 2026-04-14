import { School } from '@/src/domain/entities/school';

export let schools: School[] = [
  { id: '1', name: 'Colégio Estadual Teotônio Brandão Vilela', address: 'R. Maria de Souza Monteiro, 91 – Sobradinho', createdAt: '2024-01-15T08:00:00.000Z' },
  { id: '2', name: 'Colégio Estadual Frei Tomás', address: 'R. Frei Tomás - Centro, 01 – Centro', createdAt: '2024-02-10T08:00:00.000Z' },
];

export function setSchools(newSchools: School[]) {
  schools = newSchools;
}