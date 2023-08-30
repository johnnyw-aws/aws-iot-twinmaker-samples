// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. 2023
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, type PointerEventHandler } from 'react';

import { SITE_TYPE } from '@/config/sites';
import { PanelLayout } from '@/lib/components/layouts';
import { CloseAllIcon } from '@/lib/components/svgs/icons';
import { CookieFactoryLogoWide } from '@/lib/components/svgs/logos';
import { createClassName, type ClassName } from '@/lib/core/utils/element';
import { PANELS } from '@/lib/init/panels';
import { globalControlStore, useGlobalControlStore } from '@/lib/stores/control';
import { useSelectedStore } from '@/lib/stores/entity';
import { panelsStore, usePanelsStore } from '@/lib/stores/panels';
import { useSiteStore } from '@/lib/stores/site';
import type { GlobalControl, Panel } from '@/lib/types';

import controlStyles from './control.module.css';
import styles from './styles.module.css';

const VIEW_LABEL = 'Monitor';

// const closeAllControl = (
//   <button className={styles.closeAllIcon} key={crypto.randomUUID()} onPointerUp={() => panelsStore.setState([])}>
//     <CloseAllIcon />
//   </button>
// );

export function PanelView({ className }: { className?: ClassName }) {
  const [, setGlobalControl] = useGlobalControlStore();
  const [panels, setPanels] = usePanelsStore();
  const [selectedEntity] = useSelectedStore();
  const [site] = useSiteStore();

  const viewLabel = useMemo(() => {
    return `${selectedEntity.entityData ? selectedEntity.entityData.type : SITE_TYPE} ${VIEW_LABEL}`;
  }, [selectedEntity]);

  const closeAllButton = useMemo(() => {
    const { entityData } = selectedEntity;
    const type = entityData ? entityData.type : SITE_TYPE;

    return panels.length ? (
      <button className={styles.closeAllIcon} key={crypto.randomUUID()} onPointerUp={() => setPanels([])}>
        <CloseAllIcon />
      </button>
    ) : null;
  }, [panels, selectedEntity]);

  const head = useMemo(() => {
    if (panels.length) {
      if (selectedEntity.entityData) {
        return (
          <div className={styles.head}>
            <div className={styles.entityName}>{selectedEntity.entityData.name}</div>
            {selectedEntity.entityData.type && (
              <div className={styles.entityType}>{selectedEntity.entityData.type}</div>
            )}
          </div>
        );
      }

      if (site) {
        return (
          <div className={styles.head}>
            <div className={styles.entityName}>{site?.name}</div>
            <div className={styles.entityType}>{SITE_TYPE}</div>
          </div>
        );
      }
    }

    return null;
  }, [panels, selectedEntity, site]);

  // useEffect(() => {
  //   if (panelsStore.length) {
  //     setGlobalControl((globalControl) => {
  //       return !globalControl.includes(closeAllControl) ? [...globalControl, closeAllControl] : globalControl;
  //     });
  //   } else {
  //     setGlobalControl((globalControl) => removeGlobalControls(globalControl));
  //   }
  // }, [panelsStore]);

  // useEffect(() => {
  //   return () => globalControlStore.setState(removeGlobalControls);
  // }, []);

  return (
    <main className={createClassName(styles.root, className)} data-has-panels={panels.length > 0}>
      <section className={styles.viewInfo}>
        {viewLabel}
        {closeAllButton}
      </section>
      {head}
      <Panels />
      <ControlLayout />
    </main>
  );
}

function Panels() {
  const [panelsStore] = usePanelsStore();
  const isExpandable = useMemo(() => panelsStore.length > 1, [panelsStore]);

  const panelElements = useMemo(() => {
    if (panelsStore.length === 0) return <EmptyState />;

    return PANELS.sort((a, b) => a.priority - b.priority)
      .sort((a, b) => a.slot - b.slot)
      .reduce<JSX.Element[]>((accum, panel) => {
        const hasPanel = panelsStore.find((id) => id == panel.id);

        if (hasPanel) {
          accum.push(<PanelLayout key={panel.id} isExpandable={isExpandable} panel={panel} />);
        }

        return accum;
      }, []);
  }, [panelsStore]);

  return (
    <main className={createClassName(styles.panels)} data-count={panelsStore.length}>
      {panelElements}
    </main>
  );
}

function ControlLayout({ className }: { className?: ClassName }) {
  const group1 = PANELS.filter(({ slot }) => slot === 1);
  const group2 = PANELS.filter(({ slot }) => slot === 2);

  return (
    <main className={createClassName(styles.controls, className)}>
      {group1.length > 0 ? (
        <section className={styles.controlGroup}>
          {group1.map((panel) => (
            <Control key={panel.id} panel={panel} />
          ))}
        </section>
      ) : null}
      {group2.length > 0 ? (
        <section className={styles.controlGroup}>
          {group2.map((panel) => (
            <Control key={panel.id} panel={panel} />
          ))}
        </section>
      ) : null}
    </main>
  );
}

function Control({ panel: { icon, id, label } }: { panel: Panel }) {
  const [panelsStore, setPanelStore] = usePanelsStore();

  const handlePointerUp = useCallback<PointerEventHandler<HTMLButtonElement>>(({ nativeEvent: { altKey } }) => {
    setPanelStore((panels) => {
      const hasPanelId = panels.includes(id);

      if (altKey) {
        if (hasPanelId && panels.length === 1) {
          panels.length = 0;
        } else {
          panels.length = 0;
          panels.push(id);
        }
      } else {
        if (hasPanelId) {
          const filtered = panels.filter((panelId) => panelId !== id);
          panels.length = 0;
          panels.push(...filtered);
        } else {
          panels.push(id);
        }
      }
      return panels;
    });
  }, []);

  return (
    <button
      className={controlStyles.button}
      data-is-active={panelsStore.length > 0}
      data-is-selected={panelsStore.includes(id)}
      onPointerUp={handlePointerUp}
    >
      <div className={controlStyles.icon}>{icon}</div>
      <div className={controlStyles.label}>{label}</div>
    </button>
  );
}
//Todo      Commented out of emptystate <CookieFactoryLogoWide className={styles.emptyStateLogo} />

function EmptyState() {
  return <main className={styles.emptyState}></main>;
}

// function removeGlobalControls(controls: GlobalControl[]) {
//   return controls.filter((control) => control !== closeAllControl);
// }
