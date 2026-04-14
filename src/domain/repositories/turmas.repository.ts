import { CreateTurmaDTO, Turma, UpdateTurmaDTO } from '@/src/domain/entities/turma';
import { API_BASE } from '@/src/infrastructure/mocks/constants';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`[${res.status}] ${msg}`);
  }
  return res.json() as Promise<T>;
}

class TurmasRepository {
  async findBySchool(schoolId: string): Promise<Turma[]> {
    const res = await fetch(`${API_BASE}/schools/${schoolId}/classes`);
    return handleResponse<Turma[]>(res);
  }

  async create(schoolId: string, data: CreateTurmaDTO): Promise<Turma> {
    const res = await fetch(`${API_BASE}/schools/${schoolId}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Turma>(res);
  }

  async update(id: string, data: UpdateTurmaDTO): Promise<Turma> {
    const res = await fetch(`${API_BASE}/classes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Turma>(res);
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/classes/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Erro ao deletar turma ${id}`);
  }
}

export const turmasRepository = new TurmasRepository();
