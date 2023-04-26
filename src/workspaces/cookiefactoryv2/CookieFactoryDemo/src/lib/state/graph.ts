import { createState, createStateHook } from '@/lib/creators/state';

export const hopState = createState<-1 | 0 | 1 | 2>(-1);

export const useHopState = createStateHook(hopState);
