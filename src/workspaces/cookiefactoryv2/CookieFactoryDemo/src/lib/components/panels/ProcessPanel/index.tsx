import { ExecuteQueryCommand } from '@aws-sdk/client-iottwinmaker';
import { useCallback, useEffect, useRef, useState } from 'react';

import { FitIcon, MinusIcon, PlusIcon, TargetIcon } from '@/lib/components/svgs/icons';
import { createGraph, getElementsDefinition, type EdgeData, type NodeData } from '@/lib/graph';
import { createQueryByEquipment, fullEquipmentAndProcess } from '@/lib/queries';
import { usePanelState, useSelectedEntityState, useSiteState, useTwinMakerClientState } from '@/lib/state';
import type { TwinMakerQueryData, TwinMakerQueryEdgeData, TwinMakerQueryNodeData } from '@/lib/types';
import { createClassName, type ClassName } from '@/lib/utils/element';

import styles from './styles.module.css';

const GRAPH_CANVAS_PADDING = 30;

export function ProcessPanel({ className }: { className?: ClassName }) {
  const [client] = useTwinMakerClientState();
  const [panels] = usePanelState();
  const [selectedEntity, setSelectedEntity] = useSelectedEntityState();
  const [site] = useSiteState();
  const [graph, setGraph] = useState<ReturnType<typeof createGraph>>();
  const ref = useRef<HTMLElement>(null);

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
                  const component = components.find(
                    (component) =>
                      component.componentName === 'EquipmentComponent' ||
                      component.componentName === 'ProcessStepComponent'
                  );

                  if (component) {
                    const { componentName } = component;

                    nodeData.set(entityId, {
                      entityData: { componentName, entityId, entityName },
                      id: entityId,
                      name: entityName,
                      shape: componentName === 'EquipmentComponent' ? 'hexagon' : 'ellipse',
                      state: 'unknown'
                    });
                  }
                }

                if (isTwinMakerQueryEdgeData(item)) {
                  const id = `${item.sourceEntityId}-${item.targetEntityId}`;
                  const lineStyle = item.relationshipName === 'belongTo' ? 'dashed' : 'solid';

                  edgeData.set(id, {
                    id,
                    lineStyle,
                    source: item.sourceEntityId,
                    target: item.targetEntityId
                  });
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
          graph.resize();
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
              setSelectedEntity({ entityData: data.entityData, type: 'process' });
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
    </main>
  );
}

function isTwinMakerQueryEdgeData(item: any): item is TwinMakerQueryEdgeData {
  return item.relationshipName !== undefined;
}

function isTwinMakerQueryNodeData(item: any): item is TwinMakerQueryNodeData {
  return item.entityId !== undefined;
}
