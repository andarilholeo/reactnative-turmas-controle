/**
 * SchoolsContext — Gerenciamento de estado global com Context API
 *
 * Por que Context API ao invés de Redux ou Zustand?
 *  - O projeto é de médio porte; Context API é suficiente e nativo do React.
 *  - Sem dependência externa, código mais simples de entender e manter.
 *  - Combina perfeitamente com hooks customizados.
 *
 * Estrutura:
 *  1. SchoolsContext      → o "canal" de dados (createContext)
 *  2. SchoolsProvider     → componente que fornece os dados (wraps a árvore)
 *  3. useSchools          → hook que consome o contexto com verificação de erro
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { CreateSchoolDTO, School, UpdateSchoolDTO } from '@/src/entities/school';
import { schoolsRepository } from '@/src/services/schools.service';

/** Chave usada para persistir a lista de escolas no dispositivo. */
export const CACHE_KEY = '@controle_turmas:schools';

// ── 1. Tipo do contexto ───────────────────────────────────────────────────────
interface SchoolsContextData {
  schools: School[];
  isLoading: boolean;
  error: string | null;
  addSchool: (data: CreateSchoolDTO) => Promise<void>;
  updateSchool: (id: string, data: UpdateSchoolDTO) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const SchoolsContext = createContext<SchoolsContextData>(
  undefined as unknown as SchoolsContextData
);

// ── 2. Provider ───────────────────────────────────────────────────────────────
export function SchoolsProvider({ children }: { children: React.ReactNode }) {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Estratégia stale-while-revalidate:
   * 1. Exibe o cache do AsyncStorage imediatamente (sem espera de rede)
   * 2. Busca dados frescos da API (MSW) em paralelo
   * 3. Atualiza a UI e o cache com os dados novos
   */
  const loadSchools = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Cache first — resposta instantânea ao usuário
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        setSchools(JSON.parse(cached) as School[]);
        setIsLoading(false); // libera a tela com dados cacheados
      }

      // 2. Revalidate — busca dados atualizados
      const fresh = await schoolsRepository.findAll();
      setSchools(fresh);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
    } catch (err) {
      setError('Erro ao carregar escolas.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadSchools(); }, [loadSchools]);

  const addSchool = useCallback(async (data: CreateSchoolDTO) => {
    const newSchool = await schoolsRepository.create(data);
    setSchools((prev) => {
      const updated = [...prev, newSchool];
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateSchool = useCallback(async (id: string, data: UpdateSchoolDTO) => {
    const updated = await schoolsRepository.update(id, data);
    setSchools((prev) => {
      const next = prev.map((s) => (s.id === id ? updated : s));
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteSchool = useCallback(async (id: string) => {
    await schoolsRepository.delete(id);
    setSchools((prev) => {
      const next = prev.filter((s) => s.id !== id);
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo<SchoolsContextData>(
    () => ({ schools, isLoading, error, addSchool, updateSchool, deleteSchool, refresh: loadSchools }),
    [schools, isLoading, error, addSchool, updateSchool, deleteSchool, loadSchools]
  );

  return <SchoolsContext.Provider value={value}>{children}</SchoolsContext.Provider>;
}

// ── 4. Hook customizado ───────────────────────────────────────────────────────
/**
 * `useSchools` é o único ponto de acesso ao contexto.
 * Ele verifica se foi chamado dentro de um `SchoolsProvider` e
 * lança um erro descritivo caso contrário — facilita o debug.
 */
export function useSchools(): SchoolsContextData {
  const context = useContext(SchoolsContext);
  if (!context) {
    throw new Error('useSchools deve ser usado dentro de um <SchoolsProvider>');
  }
  return context;
}
