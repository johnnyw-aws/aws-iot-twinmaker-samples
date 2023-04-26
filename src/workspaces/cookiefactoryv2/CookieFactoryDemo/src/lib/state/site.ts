import { createState, createStateHook } from '@/lib/creators/state';
import type { Site } from '@/lib/types';

export const siteState = createState<Site | null>(null);

export const useSiteState = createStateHook(siteState);
