import { ExecuteQueryCommand } from '@aws-sdk/client-iottwinmaker';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ALARM_PROPERTY_NAME, COMPONENT_NAMES } from '@/config/iottwinmaker';
import { FitIcon, MinusIcon, PlusIcon, TargetIcon } from '@/lib/components/svgs/icons';
import { isIgnoredEntity, normalizedEntityData } from '@/lib/entities';
import { createGraph, getElementsDefinition, type EdgeData, type NodeData, type NodeRenderData } from '@/lib/graph';
import { useTimeSeriesDataQuery } from '@/lib/hooks';
import { TimeSeriesDataProvider } from '@/lib/providers';
import { createQueryByEquipment, fullEquipmentAndProcess } from '@/lib/queries';
import {
  usePanelState,
  useSelectedEntityState,
  useSiteState,
  useTimeSeriesDataState,
  useTwinMakerClientState
} from '@/lib/state';
import type { AlarmState, TwinMakerQueryData, TwinMakerQueryEdgeData, TwinMakerQueryNodeData } from '@/lib/types';
import { createClassName, type ClassName } from '@/lib/utils/element';
import { getEntityHistoryQuery } from '@/lib/utils/entity';

import styles from './styles.module.css';

type Meta = {
  entityId: string;
  componentName: string;
  propertyName: string;
};

const GRAPH_CANVAS_PADDING = 30;
const alarmHistoryQuery = normalizedEntityData.map((entity) => getEntityHistoryQuery(entity, 'alarm'));
const dataHistoryQuery = normalizedEntityData.map((entity) => getEntityHistoryQuery(entity, 'data'));

export function ProcessPanel({ className }: { className?: ClassName }) {
  const [alarmQuery] = useTimeSeriesDataQuery(alarmHistoryQuery);
  const [dataQuery] = useTimeSeriesDataQuery(dataHistoryQuery);
  const [client] = useTwinMakerClientState();
  const [panels] = usePanelState();
  const [selectedEntity, setSelectedEntity] = useSelectedEntityState();
  const [site] = useSiteState();
  const [dataStreams] = useTimeSeriesDataState();
  const [graph, setGraph] = useState<ReturnType<typeof createGraph>>();
  const ref = useRef<HTMLElement>(null);

  const timeSeriesDataprovider = useMemo(() => {
    if (alarmQuery.length && dataQuery.length) {
      return <TimeSeriesDataProvider queries={[...alarmQuery, ...dataQuery]} />;
    }
  }, [alarmQuery, dataQuery]);

  const loadData = useCallback(
    async (queryStatement: string) => {
      if (client && site) {
        const command = new ExecuteQueryCommand({
          queryStatement,
          workspaceId: site.awsConfig.workspaceId
        });

        const { rows } = await client.send(command);

        if (rows) {
          const nodeData = new Map<string, NodeData>();
          const edgeData = new Map<string, EdgeData>();

          for await (const { rowData } of rows as TwinMakerQueryData) {
            if (rowData) {
              for await (const item of rowData) {
                if (isTwinMakerQueryNodeData(item)) {
                  const { entityId, entityName, components } = item;

                  if (!isIgnoredEntity(entityId)) {
                    const component = components.find(
                      ({ componentName }) =>
                        componentName === COMPONENT_NAMES.EQUIPMENT || componentName === COMPONENT_NAMES.PROCESS_STEP
                    );

                    if (component) {
                      const { componentName } = component;
                      const entityData = normalizedEntityData.find(({ entityId: id }) => id === entityId) ?? {
                        entityId,
                        componentName,
                        properties: []
                      };

                      nodeData.set(entityId, {
                        entityData,
                        id: entityId,
                        label: entityName,
                        shape: componentName === COMPONENT_NAMES.EQUIPMENT ? 'hexagon' : 'ellipse',
                        state: componentName === COMPONENT_NAMES.EQUIPMENT ? 'Unknown' : 'Normal'
                      });
                    }
                  }
                }

                if (isTwinMakerQueryEdgeData(item)) {
                  const { relationshipName, sourceEntityId, targetEntityId } = item;

                  if (!isIgnoredEntity(sourceEntityId) && !isIgnoredEntity(targetEntityId)) {
                    const id = `${sourceEntityId}-${targetEntityId}`;
                    const lineStyle = relationshipName === 'belongTo' ? 'dashed' : 'solid';

                    edgeData.set(id, {
                      id,
                      label: relationshipName,
                      lineStyle,
                      source: sourceEntityId,
                      target: targetEntityId
                    });
                  }
                }
              }
            }
          }

          return { edgeData, nodeData };
        }
      }
    },
    [client, site]
  );

  const executeQuery = useCallback(
    async (selectedEntityId?: string) => {
      if (graph) {
        const data = await loadData(
          selectedEntityId ? createQueryByEquipment(selectedEntityId, 2) : fullEquipmentAndProcess
        );

        if (data) {
          graph.setGraphData(getElementsDefinition([...data.nodeData.values()], [...data.edgeData.values()]));
          // graph.setZoom(1);
          graph.center();
          if (selectedEntityId) graph.selectNode(selectedEntityId);
        }
      }
    },
    [graph]
  );

  const handleCenterClick = useCallback(() => {
    graph?.center();
  }, [graph]);

  const handleFitClick = useCallback(() => {
    graph?.fit(undefined, GRAPH_CANVAS_PADDING);
  }, [graph]);

  const handleZoomInClick = useCallback(() => {
    if (graph) {
      const currentScale = graph.getZoom();
      graph.setZoom(currentScale + 0.1);
    }
  }, [graph]);

  const handleZoomOutClick = useCallback(() => {
    if (graph) {
      const currentScale = graph.getZoom();
      graph.setZoom(currentScale - 0.1);
    }
  }, [graph]);

  useEffect(() => {
    if (graph) {
      if (selectedEntity.entityData) {
        if (selectedEntity.type !== 'process') executeQuery(selectedEntity.entityData.entityId);
      } else {
        graph.deselectNode();
        executeQuery();
      }
    }
  }, [graph, selectedEntity, executeQuery]);

  useEffect(() => {
    graph?.resize();
    graph?.center();
  }, [graph, panels]);

  useEffect(() => {
    if (ref.current) {
      const graph = createGraph(ref.current, { canvasPadding: GRAPH_CANVAS_PADDING, fitOnLoad: true });

      graph.subscribe(({ eventName, data }) => {
        switch (eventName) {
          case 'click': {
            if (data?.entityData) {
              const { entityData } = data as NodeRenderData;
              setSelectedEntity({ entityData, type: 'process' });
            } else {
              setSelectedEntity({ entityData: null, type: 'process' });
            }
            break;
          }
        }
      });

      setGraph(graph);

      return () => {
        graph.dispose();
      };
    }
  }, []);

  useEffect(() => {
    executeQuery();
  }, [graph]);

  useEffect(() => {
    if (graph && dataStreams.length) {
      for (const { data, meta } of dataStreams) {
        if (meta) {
          const { entityId, propertyName } = meta as Meta;
          const latestValue = data[data.length - 1];

          if (propertyName === ALARM_PROPERTY_NAME) {
            graph.updateNode(entityId, { state: latestValue.y as AlarmState });
          } else {
            // console.log(entityId, propertyName, latestValue);
          }
        }
      }
    }
  }, [dataStreams, graph]);

  return (
    <main className={createClassName(styles.root, className)}>
      <section ref={ref} className={styles.canvas} />
      <section className={styles.controls}>
        <button className={styles.button} onPointerDown={handleFitClick}>
          <FitIcon className={styles.buttonFitIcon} />
        </button>
        <button className={styles.button} onPointerDown={handleCenterClick}>
          <TargetIcon className={styles.buttonCenterIcon} />
        </button>
        <button className={styles.button} onPointerDown={handleZoomInClick}>
          <PlusIcon className={styles.buttonZoomInIcon} />
        </button>
        <button className={styles.button} onPointerDown={handleZoomOutClick}>
          <MinusIcon className={styles.buttonZoomOutIcon} />
        </button>
      </section>
      {timeSeriesDataprovider}
    </main>
  );
}

function isTwinMakerQueryEdgeData(item: any): item is TwinMakerQueryEdgeData {
  return item.relationshipName !== undefined;
}

function isTwinMakerQueryNodeData(item: any): item is TwinMakerQueryNodeData {
  return item.entityId !== undefined;
}
