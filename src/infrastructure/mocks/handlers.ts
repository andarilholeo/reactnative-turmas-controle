import { schoolsHandlers } from './handlers/schools.handlers';
import { turmasHandlers } from './handlers/turmas.handlers';

export const handlers = [...schoolsHandlers, ...turmasHandlers];

