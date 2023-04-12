import type { Viewport } from '@iot-app-kit/core';
import type { TwinMakerQuery } from '@iot-app-kit/source-iottwinmaker';

import { QUERY_ENTITY_IDS } from '@/config/iottwinmaker';

export const entityQueries = QUERY_ENTITY_IDS.map<TwinMakerQuery>((entityId) => {
  return {
    entityId,
    componentName: 'CookieLineComponent',
    properties: [{ propertyName: 'alarm_status' }]
  };
});



export const viewport: Viewport = { duration: '5m' };
