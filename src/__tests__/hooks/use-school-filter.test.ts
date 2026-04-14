/**
 * Testes do hook useSchoolFilter
 *
 * Por que testar um hook isoladamente?
 * - É lógica pura (não depende de componentes) → fácil de testar.
 * - renderHook() executa o hook num ambiente React mínimo.
 * - Garante que o useMemo se comporta corretamente com diferentes inputs.
 */
import { useSchoolFilter } from '@/hooks/use-school-filter';
import { School } from '@/src/domain/entities/school';
import { renderHook } from '@testing-library/react-native';

const MOCK_SCHOOLS: School[] = [
  { id: '1', name: 'Escola Dom Pedro I',  address: 'Rua das Flores, 123',  createdAt: '' },
  { id: '2', name: 'Escola Tiradentes',   address: 'Av. Independência, 456', createdAt: '' },
  { id: '3', name: 'EMEI Duque de Caxias', address: 'Praça da República, 789', createdAt: '' },
];

describe('useSchoolFilter', () => {
  it('retorna todas as escolas quando query está vazia', () => {
    const { result } = renderHook(() => useSchoolFilter(MOCK_SCHOOLS, ''));
    expect(result.current).toHaveLength(3);
  });

  it('retorna todas as escolas quando query tem só espaços', () => {
    const { result } = renderHook(() => useSchoolFilter(MOCK_SCHOOLS, '   '));
    expect(result.current).toHaveLength(3);
  });

  it('filtra por nome (case-insensitive)', () => {
    const { result } = renderHook(() => useSchoolFilter(MOCK_SCHOOLS, 'DOM PEDRO'));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('1');
  });

  it('filtra por endereço', () => {
    const { result } = renderHook(() => useSchoolFilter(MOCK_SCHOOLS, 'independência'));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('2');
  });

  it('retorna vazio quando nenhuma escola corresponde', () => {
    const { result } = renderHook(() => useSchoolFilter(MOCK_SCHOOLS, 'xyz_inexistente'));
    expect(result.current).toHaveLength(0);
  });

  it('retorna múltiplos resultados quando há correspondências parciais', () => {
    // "escola" aparece em duas das três escolas
    const { result } = renderHook(() => useSchoolFilter(MOCK_SCHOOLS, 'escola'));
    expect(result.current).toHaveLength(2);
  });

  it('não muta a lista original', () => {
    const original = [...MOCK_SCHOOLS];
    renderHook(() => useSchoolFilter(MOCK_SCHOOLS, 'dom'));
    expect(MOCK_SCHOOLS).toEqual(original);
  });
});
