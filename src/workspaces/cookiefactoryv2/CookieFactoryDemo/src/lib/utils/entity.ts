import type { EntityData, EntityPropertyType, TwinMakerEntityHistoryQuery, TwinMakerQuery } from '@/lib/types';
import type { ValueOf } from 'type-fest';

export function getEntityHistoryQuery<T extends EntityData>(
  entityData: T,
  propertyType: EntityPropertyType
): TwinMakerEntityHistoryQuery {
  const { componentName, entityId, properties } = entityData;

  const reducedProperties = properties.reduce<ValueOf<TwinMakerEntityHistoryQuery, 'properties'>>(
    (accum, { propertyQueryInfo, type }) => {
      if (type === propertyType) {
        accum.push(propertyQueryInfo);
      }
      return accum;
    },
    []
  );

  return { componentName, entityId, properties: reducedProperties };
}

export function getEntityHistoryQueries<T extends EntityData>(
  entityData: T,
  propertyType: EntityPropertyType
): TwinMakerEntityHistoryQuery[] {
  const { componentName, entityId, properties } = entityData;

  return properties.reduce<TwinMakerEntityHistoryQuery[]>((accum, { propertyQueryInfo, type }) => {
    if (type === propertyType) {
      accum.push({ componentName, entityId, properties: [propertyQueryInfo] });
    }
    return accum;
  }, []);
}
