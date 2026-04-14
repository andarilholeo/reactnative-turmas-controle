import { CreateSchoolDTO, School } from '@/src/domain/entities/school';
import { schools, setSchools } from '../data/schools.data';
import { json, RouteHandler, uid } from '../types';


export const schoolsHandlers: RouteHandler[] = [
  {
    method: 'GET',
    pattern: '/api/schools',
    resolve: () => json(schools),
  },

  {
    method: 'POST',
    pattern: '/api/schools',
    resolve: async (_, req) => {
      const body = (await req.json()) as CreateSchoolDTO;
      const school: School = { ...body, id: uid(), createdAt: new Date().toISOString() };
      setSchools([...schools, school]);
      return json(school, 201);
    },
  },

  {
    method: 'PUT',
    pattern: '/api/schools/:id',
    resolve: async ({ id }, req) => {
      const body = (await req.json()) as Partial<CreateSchoolDTO>;
      const idx = schools.findIndex((s) => s.id === id);
      if (idx === -1) return json({ message: 'Not found' }, 404);
      const updated = { ...schools[idx], ...body };
      setSchools(schools.map((s, i) => (i === idx ? updated : s)));
      return json(updated);
    },
  },

  {
    method: 'DELETE',
    pattern: '/api/schools/:id',
    resolve: ({ id }) => {
      setSchools(schools.filter((s) => s.id !== id));
      return new Response(null, { status: 204 });
    },
  },
];