import { CreateSchoolDTO, School } from '@/src/entities/school';
import { CreateTurmaDTO, Turma } from '@/src/entities/turma';
import { API_BASE } from './constants';

export { API_BASE };

export type RouteHandler = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  pattern: string;
  resolve: (
    params: Record<string, string>,
    req: Request,
  ) => Response | Promise<Response>;
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

let schools: School[] = [
  { id: '1', name: 'Colégio Estadual Teotônio Brandão Vilela',    address: 'R. Maria de Souza Monteiro, 91 – Sobradinho',          createdAt: '2024-01-15T08:00:00.000Z' },
  { id: '2', name: 'Colégio Estadual Frei Tomás',      address: 'R. Frei Tomás - Centro, 01 – Centro',    createdAt: '2024-02-10T08:00:00.000Z' },
];

let turmas: Turma[] = [
  { id: '101', schoolId: '1', name: '1º Ano A', shift: 'morning',   academicYear: 2025, createdAt: '2025-01-10T08:00:00.000Z' },
  { id: '102', schoolId: '1', name: '2º Ano B', shift: 'afternoon', academicYear: 2025, createdAt: '2025-01-10T08:00:00.000Z' },
  { id: '103', schoolId: '1', name: '3º Ano C', shift: 'evening',   academicYear: 2025, createdAt: '2025-01-10T08:00:00.000Z' },
  { id: '201', schoolId: '2', name: '1º Ano A', shift: 'morning',   academicYear: 2025, createdAt: '2025-01-11T08:00:00.000Z' },
  { id: '202', schoolId: '2', name: '2º Ano B', shift: 'afternoon', academicYear: 2025, createdAt: '2025-01-11T08:00:00.000Z' },
];

const uid = () => Date.now().toString();

export const handlers: RouteHandler[] = [

  { method: 'GET', pattern: '/api/schools',
    resolve: () => json(schools) },

  { method: 'POST', pattern: '/api/schools',
    resolve: async (_, req) => {
      const body = (await req.json()) as CreateSchoolDTO;
      const school: School = { ...body, id: uid(), createdAt: new Date().toISOString() };
      schools.push(school);
      return json(school, 201);
    } },

  { method: 'PUT', pattern: '/api/schools/:id',
    resolve: async ({ id }, req) => {
      const body = (await req.json()) as Partial<CreateSchoolDTO>;
      const idx = schools.findIndex((s) => s.id === id);
      if (idx === -1) return json({ message: 'Not found' }, 404);
      schools[idx] = { ...schools[idx], ...body };
      return json(schools[idx]);
    } },

  { method: 'DELETE', pattern: '/api/schools/:id',
    resolve: ({ id }) => {
      schools = schools.filter((s) => s.id !== id);
      return new Response(null, { status: 204 });
    } },

  { method: 'GET', pattern: '/api/schools/:schoolId/classes',
    resolve: ({ schoolId }) =>
      json(turmas.filter((t) => t.schoolId === schoolId)) },

  { method: 'POST', pattern: '/api/schools/:schoolId/classes',
    resolve: async ({ schoolId }, req) => {
      const body = (await req.json()) as CreateTurmaDTO;
      const turma: Turma = { ...body, schoolId, id: uid(), createdAt: new Date().toISOString() };
      turmas.push(turma);
      return json(turma, 201);
    } },

  { method: 'PUT', pattern: '/api/classes/:id',
    resolve: async ({ id }, req) => {
      const body = (await req.json()) as Partial<CreateTurmaDTO>;
      const idx = turmas.findIndex((t) => t.id === id);
      if (idx === -1) return json({ message: 'Not found' }, 404);
      turmas[idx] = { ...turmas[idx], ...body };
      return json(turmas[idx]);
    } },

  { method: 'DELETE', pattern: '/api/classes/:id',
    resolve: ({ id }) => {
      turmas = turmas.filter((t) => t.id !== id);
      return new Response(null, { status: 204 });
    } },
];
