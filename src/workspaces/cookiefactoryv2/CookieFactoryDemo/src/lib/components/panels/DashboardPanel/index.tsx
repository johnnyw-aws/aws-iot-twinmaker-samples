import { TimeSync } from '@iot-app-kit/react-components';
import { useEffect, useMemo, useRef, useState } from 'react';

import { ALARM_THRESHOLDS, VIEWPORT } from '@/config/iottwinmaker';
import { LineChart, StatusTimeline } from '@/lib/components/charts';
import { LINE_CHART_COLORS } from '@/lib/css/colors';
import { normalizedEntityData } from '@/lib/entities';
import { useSelectedEntityState, useSiteState } from '@/lib/state';
import type { StyleSettingsMap, TwinMakerEntityHistoryQuery } from '@/lib/types';
import { createClassName, type ClassName } from '@/lib/utils/element';
import { getEntityHistoryQuery, getEntityHistoryQueries } from '@/lib/utils/entity';

import '@iot-app-kit/react-components/styles.css';
import css from './styles.module.css';

const ALL_COMPONENTS_TEXT = 'All Equipment';
const ALARM_STATUS_TEXT = 'Alarm Status';
const PROPERTY_DETAIL_TEXT = 'Property Detail';
const entityAlarmHistoryQuery = normalizedEntityData.map((entity) => getEntityHistoryQuery(entity, 'alarm'));

export function DashboardPanel({ className }: { className?: ClassName; entityId?: string }) {
  const [selectedEntity] = useSelectedEntityState();
  const [site] = useSiteState();
  const [alarmQuery, setAlarmQuery] = useState<TwinMakerEntityHistoryQuery[]>([]);
  const [dataQuery, setDataQuery] = useState<TwinMakerEntityHistoryQuery[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const entityAlarmStyles = useMemo(() => {
    return normalizedEntityData.reduce<StyleSettingsMap>((accum, entity) => {
      if (site) {
        const { entityId, properties } = entity;
        const enitySummary = site.entities[entityId];

        if (enitySummary) {
          const property = properties.find(({ type }) => type === 'alarm');

          if (property) {
            const {
              propertyQueryInfo: { refId }
            } = property;
            if (refId) {
              const name = enitySummary.entityName;
              accum[refId] = { detailedName: name, name };
            }
          }
        }
      }

      return accum;
    }, {});
  }, [site]);

  const entityDataStyles = useMemo(() => {
    return normalizedEntityData.reduce<StyleSettingsMap>((accum, entity) => {
      if (site) {
        const { entityId, properties } = entity;
        const enitySummary = site.entities[entityId];

        if (enitySummary) {
          properties
            .filter(({ type }) => type === 'data')
            .forEach(({ propertyQueryInfo: { propertyName, refId } }, index) => {
              if (refId) {
                const unit = propertyName === 'Speed' ? 'rpm' : '°F';
                accum[refId] = {
                  detailedName: propertyName,
                  name: propertyName,
                  color: LINE_CHART_COLORS[index],
                  unit
                };
              }
            });
        }
      }

      return accum;
    }, {});
  }, [site]);

  const lineChartElement = useMemo(() => {
    if (dataQuery.length) {
      return dataQuery.map((query) => {
        return (
          <LineChart
            axis={{ showX: true, showY: true }}
            key={JSON.stringify(query)}
            queries={[query]}
            styles={entityDataStyles}
          />
        );
      });
    }
    return null;
  }, [dataQuery, entityDataStyles]);

  const statusTimelineElement = useMemo(() => {
    return alarmQuery.length ? (
      <StatusTimeline queries={alarmQuery} thresholds={ALARM_THRESHOLDS} styles={entityAlarmStyles} />
    ) : null;
  }, [alarmQuery, entityAlarmStyles]);

  useEffect(() => {
    const { entityData } = selectedEntity;

    if (chartContainerRef.current) {
      setAlarmQuery(entityData ? [getEntityHistoryQuery(entityData, 'alarm')] : entityAlarmHistoryQuery);
      setDataQuery(entityData ? getEntityHistoryQueries(entityData, 'data') : []);
    }
  }, [selectedEntity]);

  // useEffect(() => {
  //   if (chartContainerRef.current) {
  //     setAlarmQuery(entityAlarmHistoryQuery);
  //     setDataQuery([]);
  //   }
  // }, []);

  return (
    <main
      className={createClassName(css.root, className, { [css.multi]: selectedEntity.entityData !== null })}
      ref={chartContainerRef}
    >
      <TimeSync initialViewport={VIEWPORT}>
        <div className={css.name}>{selectedEntity.entityData ? ALARM_STATUS_TEXT : ALL_COMPONENTS_TEXT}</div>
        {statusTimelineElement}
        {lineChartElement && (
          <>
            <div className={css.name}>{PROPERTY_DETAIL_TEXT}</div>
            {lineChartElement}
          </>
        )}
      </TimeSync>
    </main>
  );
}
