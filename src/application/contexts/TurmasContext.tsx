import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { CreateTurmaDTO, Turma, UpdateTurmaDTO } from '@/src/domain/entities/turma';
import { turmasRepository } from '@/src/domain/repositories/turmas.repository';

const cacheKey = (schoolId: string) => `@controle_turmas:turmas:${schoolId}`;

interface TurmasContextData {
  turmas: Turma[];
  isLoading: boolean;
  error: string | null;
  addTurma: (data: CreateTurmaDTO) => Promise<void>;
  updateTurma: (id: string, data: UpdateTurmaDTO) => Promise<void>;
  deleteTurma: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const TurmasContext = createContext<TurmasContextData>(
  undefined as unknown as TurmasContextData
);

interface TurmasProviderProps {
  schoolId: string;
  children: React.ReactNode;
}

export function TurmasProvider({ schoolId, children }: TurmasProviderProps) {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTurmas = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const cached = await AsyncStorage.getItem(cacheKey(schoolId));
      if (cached) {
        setTurmas(JSON.parse(cached) as Turma[]);
        setIsLoading(false);
      }
      const fresh = await turmasRepository.findBySchool(schoolId);
      setTurmas(fresh);
      await AsyncStorage.setItem(cacheKey(schoolId), JSON.stringify(fresh));
    } catch (err) {
      setError('Erro ao carregar turmas.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    loadTurmas();
  }, [loadTurmas]);

  const addTurma = useCallback(async (data: CreateTurmaDTO) => {
    const newTurma = await turmasRepository.create(schoolId, data);
    setTurmas((prev) => {
      const updated = [...prev, newTurma];
      AsyncStorage.setItem(cacheKey(schoolId), JSON.stringify(updated));
      return updated;
    });
  }, [schoolId]);

  const updateTurma = useCallback(async (id: string, data: UpdateTurmaDTO) => {
    const updated = await turmasRepository.update(id, data);
    setTurmas((prev) => {
      const next = prev.map((t) => (t.id === id ? updated : t));
      AsyncStorage.setItem(cacheKey(schoolId), JSON.stringify(next));
      return next;
    });
  }, [schoolId]);

  const deleteTurma = useCallback(async (id: string) => {
    await turmasRepository.delete(id);
    setTurmas((prev) => {
      const next = prev.filter((t) => t.id !== id);
      AsyncStorage.setItem(cacheKey(schoolId), JSON.stringify(next));
      return next;
    });
  }, [schoolId]);

  const value = useMemo<TurmasContextData>(
    () => ({ turmas, isLoading, error, addTurma, updateTurma, deleteTurma, refresh: loadTurmas }),
    [turmas, isLoading, error, addTurma, updateTurma, deleteTurma, loadTurmas]
  );

  return <TurmasContext.Provider value={value}>{children}</TurmasContext.Provider>;
}

export function useTurmas(): TurmasContextData {
  const context = useContext(TurmasContext);
  if (!context) {
    throw new Error('useTurmas deve ser usado dentro de um <TurmasProvider>');
  }
  return context;
}
