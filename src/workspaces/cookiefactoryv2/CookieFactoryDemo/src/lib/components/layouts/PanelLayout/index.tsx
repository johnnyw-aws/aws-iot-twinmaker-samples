// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. 2023
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useMemo } from 'react';

import { createClassName, type ClassName } from '@/lib/core/utils/element';
import { CloseIcon, ExpandIcon } from '@/lib/components/svgs/icons';
import { useSelectedStore } from '@/lib/stores/entity';
import { usePanelsStore } from '@/lib/stores/panels';
import { useSiteStore } from '@/lib/stores/site';
import type { Panel } from '@/lib/types';

import styles from './styles.module.css';

export function PanelLayout({
  className,
  isExpandable,
  panel: { content, icon, id, label }
}: {
  className?: ClassName;
  isExpandable?: boolean;
  panel: Panel;
}) {
  const [, setPanelState] = usePanelsStore();
  const [selectedEntity] = useSelectedStore();
  const [site] = useSiteStore();

  const handleClose = useCallback(() => {
    setPanelState((panels) => {
      if (panels.includes(id)) {
        const filtered = panels.filter((panelId) => panelId !== id);
        panels.length = 0;
        panels.push(...filtered);
      }
      return panels;
    });
  }, []);

  const handleExpand = useCallback(() => {
    setPanelState([id]);
  }, []);

  const expandControlElement = useMemo(() => {
    return isExpandable ? (
      <button className={styles.controlIcon} onPointerUp={handleExpand}>
        <ExpandIcon />
      </button>
    ) : null;
  }, [isExpandable]);

  const entityName = useMemo(() => {
    return `${selectedEntity.entityData ? selectedEntity.entityData.name : site?.name} – `;
  }, [selectedEntity, site]);

  return (
    <main className={createClassName(styles.root, className)}>
      <section className={styles.head}>
        <section className={styles.label}>{label}</section>
        <section className={styles.controls}>
          {expandControlElement}
          <button className={createClassName(styles.controlIcon, styles.closeIcon)} onPointerUp={handleClose}>
            <CloseIcon />
          </button>
        </section>
      </section>
      <section className={styles.body}>{content}</section>
    </main>
  );
}
