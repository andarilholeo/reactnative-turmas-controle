/**
 * TurmasRepository — Padrão Repository para Turmas
 *
 * Endpoints consumidos (interceptados pelo MSW):
 *   GET    /api/schools/:schoolId/classes
 *   POST   /api/schools/:schoolId/classes
 *   PUT    /api/classes/:id
 *   DELETE /api/classes/:id
 */

import { CreateTurmaDTO, Turma, UpdateTurmaDTO } from '@/src/entities/turma';
import { API_BASE } from '@/src/mocks/constants';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`[${res.status}] ${msg}`);
  }
  return res.json() as Promise<T>;
}

class TurmasRepository {
  /** GET /api/schools/:schoolId/classes */
  async findBySchool(schoolId: string): Promise<Turma[]> {
    const res = await fetch(`${API_BASE}/schools/${schoolId}/classes`);
    return handleResponse<Turma[]>(res);
  }

  /** POST /api/schools/:schoolId/classes */
  async create(schoolId: string, data: CreateTurmaDTO): Promise<Turma> {
    const res = await fetch(`${API_BASE}/schools/${schoolId}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Turma>(res);
  }

  /** PUT /api/classes/:id */
  async update(id: string, data: UpdateTurmaDTO): Promise<Turma> {
    const res = await fetch(`${API_BASE}/classes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Turma>(res);
  }

  /** DELETE /api/classes/:id */
  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/classes/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Erro ao deletar turma ${id}`);
  }
}

export const turmasRepository = new TurmasRepository();
