import { PanelView } from '@/lib/components/views/PanelView';
import type { View, ViewId } from '@/lib/types';

export const VIEWS: Record<ViewId, View> = {
  panel: {
    content: <PanelView />,
    id: 'panel'
  }
};
