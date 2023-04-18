import { ENTITY_DATA, IGNORED_ENTITIES } from '@/config/iottwinmaker';

export const normalizedEntityData = ENTITY_DATA.filter(({ entityId }) => !isIgnoredEntity(entityId));

export function isIgnoredEntity(entityId: string) {
  return IGNORED_ENTITIES.includes(entityId);
}
