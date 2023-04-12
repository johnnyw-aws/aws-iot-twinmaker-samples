import {
  SceneViewer,
  useSceneComposerApi,
  type SelectionChangedEventCallback,
  type WidgetClickEventCallback
} from '@iot-app-kit/scene-composer';
import { useCallback, useEffect } from 'react';

import { useAppKitQueries } from '@/lib/hooks';
import { entityQueries, viewport } from '@/lib/iottwinmaker';
import { useSceneLoaderState, useSelectedEntityState, useSiteState } from '@/lib/state';
import type { DataBindingContext, EntityData } from '@/lib/types';
import { createClassName, type ClassName } from '@/lib/utils/element';
import { isNil } from '@/lib/utils/lang';

import styles from './styles.module.css';

const sceneComposerId = crypto.randomUUID();

export const ScenePanel = ({ className }: { className?: ClassName }) => {
  const { findSceneNodeRefBy, setSelectedSceneNodeRef, setCameraTarget } = useSceneComposerApi(sceneComposerId);
  const queries = useAppKitQueries(entityQueries);
  const [selectedEntity, setSelectedEntity] = useSelectedEntityState();
  const [sceneLoader] = useSceneLoaderState();
  const [site] = useSiteState();

  const handleSelectionChange: SelectionChangedEventCallback = useCallback(
    ({ componentTypes, additionalComponentData }) => {
      if (
        componentTypes.length &&
        componentTypes.every((item) => item !== 'Tag') &&
        (isNil(additionalComponentData) || additionalComponentData.length === 0)
      ) {
        setSelectedEntity({ entityData: null, type: 'scene' });
      }
    },
    [site, selectedEntity]
  );

  const handleWidgetClick: WidgetClickEventCallback = useCallback(
    ({ additionalComponentData }) => {
      let entityData: EntityData | null = null;

      if (site && additionalComponentData && additionalComponentData.length) {
        const { dataBindingContext } = additionalComponentData[0];

        if (dataBindingContext) {
          const { componentName, entityId } = dataBindingContext as DataBindingContext;
          const entity = site.entities[entityId];

          if (entity && entity.entityName) {
            entityData = { componentName, entityId, entityName: entity.entityName };
          }
        }
      }

      setSelectedEntity({ entityData, type: 'scene' });
    },
    [site, selectedEntity]
  );

  useEffect(() => {
    if (selectedEntity.entityData && selectedEntity.type !== 'scene') {
      const nodeRefs = findSceneNodeRefBy(selectedEntity.entityData);
      console.log('nodeRefs', selectedEntity.entityData, nodeRefs);
      if (nodeRefs && nodeRefs.length > 0) {
        setCameraTarget(nodeRefs[0], 'transition');
        setSelectedSceneNodeRef(nodeRefs[0]);
      }
    }

    if (isNil(selectedEntity.entityData) && selectedEntity.type !== 'scene') {
      setSelectedSceneNodeRef(undefined);
    }
  }, [selectedEntity]);

  return (
    <main className={createClassName(styles.root, className)}>
      {sceneLoader && (
        <SceneViewer
          sceneComposerId={sceneComposerId}
          // config={{
          //   dracoDecoder: {
          //     enable: true,
          //     path: 'https://www.gstatic.com/draco/versioned/decoders/1.5.3/' // path to the draco files
          //   }
          // }}
          queries={queries}
          selectedDataBinding={selectedEntity.entityData ?? undefined}
          sceneLoader={sceneLoader}
          onSelectionChanged={handleSelectionChange}
          onWidgetClick={handleWidgetClick}
          viewport={viewport}
        />
      )}
    </main>
  );
};
