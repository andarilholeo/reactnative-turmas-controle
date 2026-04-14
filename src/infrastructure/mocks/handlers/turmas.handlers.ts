import { CreateTurmaDTO, Turma } from '@/src/domain/entities/turma';
import { setTurmas, turmas } from '../data/turmas.data';
import { json, RouteHandler, uid } from '../types';


export const turmasHandlers: RouteHandler[] = [
  {
    method: 'GET',
    pattern: '/api/schools/:schoolId/classes',
    resolve: ({ schoolId }) => json(turmas.filter((t) => t.schoolId === schoolId)),
  },

  {
    method: 'POST',
    pattern: '/api/schools/:schoolId/classes',
    resolve: async ({ schoolId }, req) => {
      const body = (await req.json()) as CreateTurmaDTO;
      const turma: Turma = { ...body, schoolId, id: uid(), createdAt: new Date().toISOString() };
      setTurmas([...turmas, turma]);
      return json(turma, 201);
    },
  },

  {
    method: 'PUT',
    pattern: '/api/classes/:id',
    resolve: async ({ id }, req) => {
      const body = (await req.json()) as Partial<CreateTurmaDTO>;
      const idx = turmas.findIndex((t) => t.id === id);
      if (idx === -1) return json({ message: 'Not found' }, 404);
      const updated = { ...turmas[idx], ...body };
      setTurmas(turmas.map((t, i) => (i === idx ? updated : t)));
      return json(updated);
    },
  },

  {
    method: 'DELETE',
    pattern: '/api/classes/:id',
    resolve: ({ id }) => {
      setTurmas(turmas.filter((t) => t.id !== id));
      return new Response(null, { status: 204 });
    },
  },
];