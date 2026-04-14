/**
 * SchoolsRepository — Padrão Repository
 *
 * Agora usa fetch() real apontando para os endpoints do MSW.
 * O MSW intercepta essas chamadas antes de chegarem à rede,
 * retornando os dados mockados definidos em src/mocks/handlers.ts.
 *
 * Para migrar para uma API real no futuro: basta trocar API_BASE
 * pela URL do servidor real. O contexto e a UI não mudam nada.
 */

import { CreateSchoolDTO, School, UpdateSchoolDTO } from '@/src/entities/school';
import { API_BASE } from '@/src/mocks/constants';

// ── Helpers ───────────────────────────────────────────────────────────────────
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`[${res.status}] ${msg}`);
  }
  return res.json() as Promise<T>;
}

// ── Classe Repository ─────────────────────────────────────────────────────────
class SchoolsRepository {
  private base = `${API_BASE}/schools`;

  /** GET /api/schools */
  async findAll(): Promise<School[]> {
    const res = await fetch(this.base);
    return handleResponse<School[]>(res);
  }

  /** GET /api/schools/:id  (buscamos todos e filtramos — MSW não tem endpoint individual) */
  async findById(id: string): Promise<School | null> {
    const all = await this.findAll();
    return all.find((s) => s.id === id) ?? null;
  }

  /** POST /api/schools */
  async create(data: CreateSchoolDTO): Promise<School> {
    const res = await fetch(this.base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<School>(res);
  }

  /** PUT /api/schools/:id */
  async update(id: string, data: UpdateSchoolDTO): Promise<School> {
    const res = await fetch(`${this.base}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<School>(res);
  }

  /** DELETE /api/schools/:id */
  async delete(id: string): Promise<void> {
    const res = await fetch(`${this.base}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Erro ao deletar escola ${id}`);
  }
}

/** Singleton compartilhado em toda a aplicação. */
export const schoolsRepository = new SchoolsRepository();
