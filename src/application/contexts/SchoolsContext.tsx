import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { CreateSchoolDTO, School, UpdateSchoolDTO } from '@/src/domain/entities/school';
import { schoolsRepository } from '@/src/domain/repositories/schools.repository';

export const CACHE_KEY = '@controle_turmas:schools';

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

export function SchoolsProvider({ children }: { children: React.ReactNode }) {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSchools = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        setSchools(JSON.parse(cached) as School[]);
        setIsLoading(false);
      }
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

export function useSchools(): SchoolsContextData {
  const context = useContext(SchoolsContext);
  if (!context) {
    throw new Error('useSchools deve ser usado dentro de um <SchoolsProvider>');
  }
  return context;
}
