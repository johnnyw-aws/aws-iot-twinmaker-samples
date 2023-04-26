import { createState, createStateHook } from '@/lib/creators/state';

export const hierarchyState = createState<string | null>(null);

export const useHierarchyState = createStateHook(hierarchyState);
