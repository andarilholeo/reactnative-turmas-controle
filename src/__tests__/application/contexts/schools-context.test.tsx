import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

import { SchoolsProvider, useSchools } from '@/src/application/contexts/SchoolsContext';
import { School } from '@/src/domain/entities/school';

const MOCK_SCHOOLS: School[] = [
  { id: '1', name: 'Dom Pedro I', address: 'Rua A', createdAt: '' },
  { id: '2', name: 'Tiradentes',  address: 'Rua B', createdAt: '' },
];

jest.mock('@/src/domain/repositories/schools.repository', () => ({
  schoolsRepository: {
    findAll:  jest.fn(async () => [...MOCK_SCHOOLS]),
    create:   jest.fn(async (data: Partial<School>) => ({ ...data, id: '99', createdAt: '' })),
    update:   jest.fn(async (id: string, data: Partial<School>) => ({ ...MOCK_SCHOOLS[0], ...data, id })),
    delete:   jest.fn(async () => undefined),
    findById: jest.fn(async (id: string) => MOCK_SCHOOLS.find((s) => s.id === id) ?? null),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SchoolsProvider>{children}</SchoolsProvider>
);

describe('SchoolsContext', () => {
  describe('estado inicial', () => {
    it('começa em loading e carrega as escolas do repositório', async () => {
      const { result } = renderHook(() => useSchools(), { wrapper });
      expect(result.current.isLoading).toBe(true);
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.schools).toHaveLength(2);
      expect(result.current.error).toBeNull();
    });
  });

  describe('addSchool()', () => {
    it('adiciona a escola retornada pelo repositório à lista', async () => {
      const { result } = renderHook(() => useSchools(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      const before = result.current.schools.length;

      await act(async () => {
        await result.current.addSchool({ name: 'Nova', address: 'Rua Nova' });
      });

      expect(result.current.schools).toHaveLength(before + 1);
      expect(result.current.schools.at(-1)?.id).toBe('99');
    });
  });

  describe('deleteSchool()', () => {
    it('remove a escola com o id informado da lista local', async () => {
      const { result } = renderHook(() => useSchools(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.deleteSchool('1');
      });

      expect(result.current.schools.find((s) => s.id === '1')).toBeUndefined();
    });
  });

  describe('updateSchool()', () => {
    it('substitui a escola atualizada na lista local', async () => {
      const { result } = renderHook(() => useSchools(), { wrapper });
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.updateSchool('1', { name: 'Editado' });
      });

      expect(result.current.schools.find((s) => s.id === '1')?.name).toBe('Editado');
    });
  });

  describe('useSchools() fora do Provider', () => {
    it('lança erro descritivo quando usado sem Provider', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => renderHook(() => useSchools())).toThrow(
        'useSchools deve ser usado dentro de um <SchoolsProvider>'
      );
      spy.mockRestore();
    });
  });
});
