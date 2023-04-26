import { createState, createStateHook } from '@/lib/creators/state';
import type { PanelId } from '@/lib/types';

export const panelState = createState<PanelId[]>([]);

export const usePanelState = createStateHook(panelState);
