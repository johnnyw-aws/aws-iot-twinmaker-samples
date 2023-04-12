import { useCallback, useEffect } from 'react';
import type { CSSProperties, MouseEventHandler } from 'react';

import { PanelLayout } from '@/lib/components/layouts';
import { CloseAllIcon } from '@/lib/components/svgs/icons';
import { CookieFactoryLogoWide } from '@/lib/components/svgs/logos';
import { PANELS } from '@/lib/panels';
import { globalControlState, panelState, useGlobalControlState, usePanelState } from '@/lib/state';
import type { GlobalControl, Panel, PanelId } from '@/lib/types';
import { createClassName, type ClassName } from '@/lib/utils/element';

import controlStyles from './control.module.css';
import styles from './styles.module.css';

const closeAllControl = (
  <button className={styles.closeAllIcon} key={crypto.randomUUID()} onPointerDown={() => panelState.setState([])}>
    <CloseAllIcon />
  </button>
);

export function PanelView({ className }: { className?: ClassName }) {
  const setGlobalControl = useGlobalControlState()[1];
  const [panelState] = usePanelState();

  useEffect(() => {
    if (panelState.length) {
      setGlobalControl((globalControl) => {
        return !globalControl.includes(closeAllControl) ? [...globalControl, closeAllControl] : globalControl;
      });
    } else {
      setGlobalControl((globalControl) => removeGlobalControls(globalControl));
    }
  }, [panelState]);

  useEffect(() => {
    return () => globalControlState.setState(removeGlobalControls);
  }, []);

  return (
    <main className={createClassName(styles.root, className)}>
      <Panels />
      <ControlLayout />
    </main>
  );
}

function Panels() {
  const [panelState] = usePanelState();

  if (panelState.length === 0) return <EmptyState />;

  const panels = getViewData(panelState);
  let group1 = panels.filter((panel) => panel.slot === 1).sort((a, b) => a.priority - b.priority);
  let group2 = panels.filter((panel) => panel.slot === 2).sort((a, b) => a.priority - b.priority);

  if (group1.length && group2.length === 0) {
    group2.push(...group1.splice(1));
  }

  if (group2.length && group1.length === 0) {
    group1.push(group2.shift()!);
  }

  const groupsStyle: CSSProperties = {
    gridTemplateColumns: group1.length && group2.length ? '.5fr .5fr' : '1fr'
  };

  // const group1Style: CSSProperties = {
  //   gridTemplateRows: `repeat(${group1.length}, ${1 / group1.length}fr)`
  // };

  // const group2Style: CSSProperties = {
  //   gridTemplateRows: group2.length > 1 ? '.5fr .5fr' : '1fr'
  // };

  const isExpandable = panels.length > 1;

  return (
    <main className={createClassName(styles.panels)} style={groupsStyle}>
      {group1.length > 0 ? (
        <section key="group1">
          {group1.map((panel) => (
            <PanelLayout key={panel.id} isExpandable={isExpandable} panel={panel} />
          ))}
        </section>
      ) : null}
      {group2.length > 0 ? (
        <section key="group2">
          {group2.map((panel) => (
            <PanelLayout key={panel.id} isExpandable={isExpandable} panel={panel} />
          ))}
        </section>
      ) : null}
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
  const [panelState, setPanelState] = usePanelState();

  const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(({ nativeEvent: { altKey } }) => {
    setPanelState((panels) => {
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
      className={createClassName(controlStyles.root, {
        [controlStyles.active]: panelState.length > 0,
        [controlStyles.selected]: panelState.includes(id)
      })}
      onClick={handleClick}
    >
      <section className={controlStyles.group}>
        <div className={controlStyles.icon}>{icon}</div>
        <div className={controlStyles.label}>{label}</div>
      </section>
    </button>
  );
}

function EmptyState() {
  return (
    <main className={styles.emptyState}>
      <CookieFactoryLogoWide className={styles.emptyStateLogo} />
    </main>
  );
}

function removeGlobalControls(controls: GlobalControl[]) {
  return controls.filter((control) => control !== closeAllControl);
}

function getViewData(panelIds: PanelId[]) {
  return panelIds.reduce<Panel[]>((accum, id) => {
    const panel = PANELS.find((panel) => panel.id === id);
    if (panel) accum.push(panel);
    return accum;
  }, []);
}
