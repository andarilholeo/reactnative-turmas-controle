export interface School {
  id: string;
  name: string;
  address: string;
  createdAt: string;
}

export type CreateSchoolDTO = Omit<School, 'id' | 'createdAt'>;
export type UpdateSchoolDTO = Partial<CreateSchoolDTO>;
