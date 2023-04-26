import { createMutableState, createMutableStateHook } from '@/lib/creators/state';
import type { GlobalControl } from '@/lib/types';

export const globalControlState = createMutableState<GlobalControl[]>([]);

export const useGlobalControlState = createMutableStateHook(globalControlState);
