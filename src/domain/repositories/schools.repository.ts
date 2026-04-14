import { CreateSchoolDTO, School, UpdateSchoolDTO } from '@/src/domain/entities/school';
import { API_BASE } from '@/src/infrastructure/mocks/constants';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`[${res.status}] ${msg}`);
  }
  return res.json() as Promise<T>;
}

class SchoolsRepository {
  private base = `${API_BASE}/schools`;

  async findAll(): Promise<School[]> {
    const res = await fetch(this.base);
    return handleResponse<School[]>(res);
  }

  async findById(id: string): Promise<School | null> {
    const all = await this.findAll();
    return all.find((s) => s.id === id) ?? null;
  }

  async create(data: CreateSchoolDTO): Promise<School> {
    const res = await fetch(this.base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<School>(res);
  }

  async update(id: string, data: UpdateSchoolDTO): Promise<School> {
    const res = await fetch(`${this.base}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<School>(res);
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`${this.base}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Erro ao deletar escola ${id}`);
  }
}

export const schoolsRepository = new SchoolsRepository();
