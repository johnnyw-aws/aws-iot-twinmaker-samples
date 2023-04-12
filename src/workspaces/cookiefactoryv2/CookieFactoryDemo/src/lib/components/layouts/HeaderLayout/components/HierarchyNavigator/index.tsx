import { useMemo } from 'react';
import type { ValueOf } from 'type-fest';

import { ArrowRightIcon, GlobeIcon } from '@/lib/components/svgs/icons';
import { useSelectedEntityState, useSiteState } from '@/lib/state';
import { isNil } from '@/lib/utils/lang';
import { createClassName, type ClassName } from '@/lib/utils/element';
import type { Site } from '@/lib/types';

import styles from './styles.module.css';

export function HierarchyNavigator({ className }: { className?: ClassName }) {
  const [{ entityData }] = useSelectedEntityState();
  const [siteState, setSiteState] = useSiteState();

  const contentElement = useMemo(() => {
    if (siteState) {
      const parents = walkParentEntities(siteState.entities, entityData?.entityId);

      return (
        <>
          <button className={styles.icon} onPointerDown={() => setSiteState(null)}>
            <GlobeIcon />
          </button>

          <span className={styles.seperator}>
            <ArrowRightIcon />
          </span>

          <span className={createClassName(styles.label, { [styles.active]: isNil(entityData) })}>
            {siteState.name}
          </span>

          {parents.length > 0 && parents.map((parent) => <Crumb key={parent.entityId} name={parent.entityName} />)}
          {entityData && <Crumb key={entityData.entityId} isActive={true} name={entityData.entityName} />}
        </>
      );
    }

    return null;
  }, [siteState, entityData]);

  return <section className={createClassName(styles.root, className)}>{contentElement}</section>;
}

function Crumb({ isActive = false, name }: { isActive?: boolean; name: string }) {
  return (
    <>
      <span className={styles.seperator}>
        <ArrowRightIcon />
      </span>
      <span className={createClassName(styles.label, { [styles.active]: isActive })}>{name}</span>
    </>
  );
}

function walkParentEntities(entities: ValueOf<Site, 'entities'>, selectedEntityId?: string) {
  let parents: { entityId: string; entityName: string }[] = [];
  if (selectedEntityId) {
    let parentEntityId = entities[selectedEntityId]?.parentEntityId;
    while (parentEntityId) {
      const selectedEntity = entities[parentEntityId];
      if (selectedEntity?.entityId && selectedEntity?.entityName)
        parents.unshift({ entityId: selectedEntity.entityId, entityName: selectedEntity.entityName });
      parentEntityId = selectedEntity?.parentEntityId;
    }
  }
  return parents;
}
