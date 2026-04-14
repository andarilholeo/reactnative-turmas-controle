import { School } from '@/src/domain/entities/school';
import { schoolsRepository } from '@/src/domain/repositories/schools.repository';

const FAKE_SCHOOLS: School[] = [
  { id: '1', name: 'Dom Pedro I', address: 'Rua A', createdAt: '2024-01-01T00:00:00.000Z' },
  { id: '2', name: 'Tiradentes',  address: 'Rua B', createdAt: '2024-02-01T00:00:00.000Z' },
];

const okResponse = (data: unknown) =>
  ({ ok: true, json: async () => data, text: async () => '' }) as Response;

const errResponse = (status: number) =>
  ({ ok: false, status, text: async () => 'Not Found' }) as unknown as Response;

describe('SchoolsRepository', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  describe('findAll()', () => {
    it('faz GET para /api/schools e retorna a lista', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(okResponse(FAKE_SCHOOLS));
      const result = await schoolsRepository.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Dom Pedro I');
    });

    it('lança erro quando a resposta não é ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(errResponse(500));
      await expect(schoolsRepository.findAll()).rejects.toThrow('[500]');
    });
  });

  describe('create()', () => {
    it('faz POST e retorna a escola com id e createdAt', async () => {
      const nova: School = { id: '99', name: 'Nova', address: 'Rua Nova', createdAt: '2025-01-01T00:00:00.000Z' };
      (global.fetch as jest.Mock).mockResolvedValueOnce(okResponse(nova));
      const result = await schoolsRepository.create({ name: 'Nova', address: 'Rua Nova' });
      expect(result.id).toBe('99');
      expect(result.name).toBe('Nova');
      const [, opts] = (global.fetch as jest.Mock).mock.calls[0];
      expect(opts.method).toBe('POST');
    });
  });

  describe('update()', () => {
    it('faz PUT e retorna a escola atualizada', async () => {
      const updated = { ...FAKE_SCHOOLS[0], name: 'Atualizado' };
      (global.fetch as jest.Mock).mockResolvedValueOnce(okResponse(updated));
      const result = await schoolsRepository.update('1', { name: 'Atualizado' });
      expect(result.name).toBe('Atualizado');
      const [, opts] = (global.fetch as jest.Mock).mock.calls[0];
      expect(opts.method).toBe('PUT');
    });
  });

  describe('delete()', () => {
    it('faz DELETE e resolve sem erro', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true } as Response);
      await expect(schoolsRepository.delete('1')).resolves.toBeUndefined();
      const [, opts] = (global.fetch as jest.Mock).mock.calls[0];
      expect(opts.method).toBe('DELETE');
    });
  });

  describe('findById()', () => {
    it('retorna a escola quando o id existe', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(okResponse(FAKE_SCHOOLS));
      const result = await schoolsRepository.findById('2');
      expect(result?.name).toBe('Tiradentes');
    });

    it('retorna null para id inexistente', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(okResponse(FAKE_SCHOOLS));
      const result = await schoolsRepository.findById('nao-existe');
      expect(result).toBeNull();
    });
  });
});
