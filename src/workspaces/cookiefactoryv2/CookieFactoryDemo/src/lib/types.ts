import type { EntitySummary } from '@aws-sdk/client-iottwinmaker';
import type { StyleSettingsMap, TimeSeriesDataQuery } from '@iot-app-kit/core';
import type { initialize, PropertyQueryInfo } from '@iot-app-kit/source-iottwinmaker';
import type { ReactNode } from 'react';

import type { AwsCredentials } from '@/lib/authentication';

export type {
  DataStream,
  StyleSettingsMap,
  Threshold,
  ThresholdSettings,
  ThresholdValue,
  TimeSeriesDataQuery
} from '@iot-app-kit/core';
export type { Axis } from '@iot-app-kit/charts-core';
export type { PropertyQueryInfo, TwinMakerEntityHistoryQuery, TwinMakerQuery } from '@iot-app-kit/source-iottwinmaker';

export type EntityData = {
  componentName: string;
  entityId: string;
  properties: EntityDataProperty[];
};

export type EntityDataProperty = {
  propertyQueryInfo: PropertyQueryInfo;
  type: EntityPropertyType;
};

export type EntityPropertyType = 'alarm' | 'data';

// export type EntitQueryData = {
//   componentName: string;
//   entityId: string;
//   property: PropertyQueryInfo;
// };

export type Event = {
  date: number;
  id: string;
  message: string;
  name: string;
  status: 'active' | 'suppressed';
  priority: 0 | 1 | 2 | 3 | 'suppressed' | 'none';
  type: 'alarm' | 'info';
};

export type GlobalControl = ReactNode;

export type AlarmState = 'High' | 'Medium' | 'Low' | 'Normal' | 'Unknown';
// export type Health = 'ok' | 'high' | 'medium' | 'low' | 'offline' | 'unknown';

export type Panel = {
  content?: ReactNode;
  icon: ReactNode;
  id: PanelId;
  label: string;
  priority: number;
  slot: 1 | 2;
  isVisible: boolean;
};

export type PanelId = 'dashboard' | 'scene' | 'process' | 'live' | 'events' | 'tickets' | 'messages';

export type SceneSelectedDataBinding = Record<'entityId' | 'componentName', string>;

export type SelectedEntity = { entityData: EntityData | null; type: 'process' | 'scene' | null };

export type Site = SiteConfig &
  Readonly<{
    entities: Record<string, EntitySummary>;
    health: AlarmState;
  }>;

export type SiteConfig = Readonly<{
  awsConfig: Readonly<TwinMakerConfig>;
  id: string;
  location: string;
  name: string;
}>;

export type TwinMakerConfig = {
  workspaceId: string;
  sceneId: string;
};

export type TimeSeriesDataQueries = {
  queries: TimeSeriesDataQuery[];
  styles: StyleSettingsMap;
};

export type TwinMakerDataSource = ReturnType<typeof initialize>;

export type TwinMakerQueryData = {
  rowData: (TwinMakerQueryNodeData | TwinMakerQueryEdgeData)[];
}[];

export type TwinMakerQueryNodeData = {
  arn: string;
  creationDate: number;
  entityId: string;
  entityName: string;
  lastUpdateDate: number;
  workspaceId: string;
  description: string;
  components: {
    componentName: 'CookieLineComponent' | 'ProcessStepComponent';
    componentTypeId: string;
    properties: {
      propertyName: string;
      propertyValue?: string;
    }[];
  }[];
};

export type TwinMakerQueryEdgeData = {
  relationshipName: 'belongTo' | 'feed' | 'flowTo';
  targetEntityId: string;
  sourceComponentName: string;
  sourceEntityId: string;
  sourceComponentTypeId: string;
};

export type User = UserConfig &
  Readonly<{
    awsCredentials?: Readonly<AwsCredentials>;
    icon: ReactNode;
  }>;

export type UserConfig = Readonly<{
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  title: string;
}>;

export type View = {
  content: ReactNode;
  id: ViewId;
};

export type ViewId = 'panel';

// AWS IoT TwinMaker types

export type DataBindingContext = {
  alarm_key: string;
  componentName: string;
  componentTypeId: string;
  entityId: string;
  propertyName: string;
};
