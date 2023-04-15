import { initialize, type SceneLoader } from '@iot-app-kit/source-iottwinmaker';
import { IoTTwinMakerClient, ListEntitiesCommand, type EntitySummary } from '@aws-sdk/client-iottwinmaker';

import type { AwsCredentials } from '@/lib/authentication';
import { createMutableState, createMutableStateHook, createState, createStateHook } from '@/lib/creators/state';
import type {
  DataStream,
  GlobalControl,
  PanelId,
  SelectedEntity,
  Site,
  TwinMakerDataSource,
  User,
  ViewId
} from '@/lib/types';
import { isNil } from '@/lib/utils/lang';

export type StateName =
  | 'twinMakerClientState'
  | 'crumbState'
  | 'panelState'
  | 'userState'
  | 'siteState'
  | 'sceneLoaderState'
  | 'selectedEntityState'
  | 'viewState';

let authCheckInterval: NodeJS.Timeout;

export const DEFAULT_SELECTED_ENTITY: SelectedEntity = { entityData: null, type: null } as const;

export const dataSourceState = createMutableState<TwinMakerDataSource | null>(null);
export const useDataSourceState = createMutableStateHook(dataSourceState);

export const crumbState = createState<string | null>(null);
export const useCrumbState = createStateHook(crumbState);

export const globalControlState = createMutableState<GlobalControl[]>([]);
export const useGlobalControlState = createMutableStateHook(globalControlState);

export const panelState = createState<PanelId[]>([]);
export const usePanelState = createStateHook(panelState);

export const selectedEntityState = createState<SelectedEntity>(DEFAULT_SELECTED_ENTITY);
export const useSelectedEntityState = createStateHook(selectedEntityState);

export const siteState = createState<Site | null>(null);
export const useSiteState = createStateHook(siteState);

export const sceneLoaderState = createMutableState<SceneLoader | null>(null);
export const useSceneLoaderState = createMutableStateHook(sceneLoaderState);

export const twinMakerClientState = createMutableState<IoTTwinMakerClient | null>(null);
export const useTwinMakerClientState = createMutableStateHook(twinMakerClientState);

export const userState = createState<User | null>(null);
export const useUserState = createStateHook(userState);

export const timeSeriesDataState = createState<DataStream[]>([]);
export const useTimeSeriesDataState = createStateHook(timeSeriesDataState);

export const viewState = createState<ViewId | null>(null);
export const useViewState = createStateHook(viewState);

userState.subscribe((getState) => {
  const state = getState();

  if (state) {
    twinMakerClientState.setState(
      new IoTTwinMakerClient({
        credentials: state.awsCredentials,
        region: state.awsCredentials!.region
      })
    );
  } else {
    const client = twinMakerClientState.getState();

    if (client) {
      client.destroy();
      twinMakerClientState.setState(null);
    }

    siteState.setState(null);
  }
});

userState.subscribe((getState) => {
  const state = getState();

  if (state?.awsCredentials) {
    authCheckInterval = setInterval(() => {
      if (!hasValidCredentials(state.awsCredentials)) userState.setState(null);
    }, 1000);
  } else {
    clearInterval(authCheckInterval);
  }
});

// panelState.subscribe((getState) => {
//   const selectedEntity = selectedEntityState.getState();
//   const state = getState();

//   switch (selectedEntity.type) {
//     case 'process': {
//       if (!state.includes('process')) selectedEntityState.setState(DEFAULT_SELECTED_ENTITY);
//       break;
//     }
//     case 'scene': {
//       if (!state.includes('scene')) selectedEntityState.setState(DEFAULT_SELECTED_ENTITY);
//       break;
//     }
//   }
// });

siteState.subscribe(async (getState) => {
  const client = twinMakerClientState.getState();
  const site = getState();
  const user = userState.getState();

  if (client && user && site && Object.keys(site.entities).length === 0) {
    const workspaceCommand = new ListEntitiesCommand({
      maxResults: 200,
      workspaceId: site.awsConfig.workspaceId
    });

    const { entitySummaries } = await client.send(workspaceCommand);

    if (entitySummaries) {
      siteState.setState((site) => {
        if (site) {
          site.entities = entitySummaries.reduce<Record<string, EntitySummary>>((accum, entity) => {
            if (entity.entityId) {
              accum[entity.entityId] = entity;
            }
            return accum;
          }, {});
        }
        return site;
      });
    }
  }
});

siteState.subscribe((getState) => {
  const site = getState();
  const user = userState.getState();

  crumbState.setState(null);
  dataSourceState.setState(null);
  panelState.setState(['dashboard']);
  sceneLoaderState.setState(null);
  selectedEntityState.setState(DEFAULT_SELECTED_ENTITY);
  viewState.setState('panel');

  if (user && site) {
    const dataSource = initialize(site.awsConfig.workspaceId, {
      awsCredentials: user.awsCredentials!,
      awsRegion: user.awsCredentials!.region
    });

    dataSourceState.setState(dataSource);
    sceneLoaderState.setState(dataSource.s3SceneLoader(site.awsConfig.sceneId));
  }
});

function isAwsCredentials(creds?: AwsCredentials | null): creds is AwsCredentials {
  return !isNil(creds);
}

function hasValidCredentials(creds?: AwsCredentials | null): creds is Exclude<AwsCredentials, undefined> {
  return isAwsCredentials(creds) && creds.expiration.getTime() > Date.now();
}
