/**
 * useSchoolFilter — hook de busca e filtro de escolas
 *
 * Por que useMemo?
 * Sem useMemo, a lista filtrada seria recalculada a cada render do componente
 * pai, mesmo quando `schools` e `query` não mudaram — custo desnecessário.
 * Com useMemo, o React só recalcula quando uma das dependências muda.
 *
 * Esse é um exemplo clássico de "lista derivada" — um estado que pode ser
 * calculado a partir de outros estados sem precisar de useState próprio.
 */
import { useMemo } from 'react';
import { School } from '@/src/entities/school';

export function useSchoolFilter(schools: School[], query: string): School[] {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return schools;
    return schools.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
    );
  }, [schools, query]);
}
