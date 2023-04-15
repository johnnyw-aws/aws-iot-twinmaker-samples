import sites from '@/config/sites';
import type { Site } from '@/lib/types';

export const SITES = sites.map<Site>((config) => ({ ...config, health: 'Normal', entities: {} }));
