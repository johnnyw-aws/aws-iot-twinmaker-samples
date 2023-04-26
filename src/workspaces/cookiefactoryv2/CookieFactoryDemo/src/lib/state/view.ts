import { createState, createStateHook } from '@/lib/creators/state';
import type { ViewId } from '@/lib/types';

export const viewState = createState<ViewId | null>(null);

export const useViewState = createStateHook(viewState);
