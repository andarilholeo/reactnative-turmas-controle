import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { CreateTurmaDTO, Turma, UpdateTurmaDTO } from '@/src/entities/turma';
import { turmasRepository } from '@/src/services/turmas.service';

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
      const data = await turmasRepository.findBySchool(schoolId);
      setTurmas(data);
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
    setTurmas((prev) => [...prev, newTurma]);
  }, [schoolId]);

  const updateTurma = useCallback(async (id: string, data: UpdateTurmaDTO) => {
    const updated = await turmasRepository.update(id, data);
    setTurmas((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const deleteTurma = useCallback(async (id: string) => {
    await turmasRepository.delete(id);
    setTurmas((prev) => prev.filter((t) => t.id !== id));
  }, []);

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
