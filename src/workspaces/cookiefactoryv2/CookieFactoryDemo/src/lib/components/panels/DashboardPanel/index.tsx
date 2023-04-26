import { TimeSync } from '@iot-app-kit/react-components';
import { useEffect, useMemo, useRef } from 'react';

import { ALARM_THRESHOLDS, VIEWPORT } from '@/config/iottwinmaker';
import { LineChart, StatusTimeline } from '@/lib/components/charts';
import { LINE_CHART_COLORS } from '@/lib/css/colors';
import { normalizedEntityData } from '@/lib/entities';
import {
  useAlarmHistoryQueryState,
  useDataHistoryQueryState,
  useSelectedState,
  useSummaryState
} from '@/lib/state/entity';
import { usePanelState } from '@/lib/state/panel';
import type { StyleSettingsMap } from '@/lib/types';
import { createClassName, type ClassName } from '@/lib/utils/element';

import '@iot-app-kit/react-components/styles.css';
import css from './styles.module.css';

const ALL_COMPONENTS_TEXT = 'Alarm Status: All Equipment';
const ALARM_STATUS_TEXT = 'Alarm Status';
const PROPERTY_DETAIL_TEXT = 'Property Detail';

export function DashboardPanel({ className }: { className?: ClassName; entityId?: string }) {
  const [alarmHistoryQuery] = useAlarmHistoryQueryState();
  const [dataHistoryQuery] = useDataHistoryQueryState();
  const [panels] = usePanelState();
  const [selectedEntity] = useSelectedState();
  const [entitySummaries] = useSummaryState();
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const entityAlarmStyles = useMemo(() => {
    return normalizedEntityData.reduce<StyleSettingsMap>((accum, entity) => {
      if (entitySummaries) {
        const { entityId, properties } = entity;
        const entitySummary = entitySummaries[entityId];

        if (entitySummary) {
          const property = properties.find(({ type }) => type === 'alarm');

          if (property) {
            const {
              propertyQueryInfo: { refId }
            } = property;
            if (refId) {
              const name = entitySummary.entityName;
              accum[refId] = { detailedName: name, name };
            }
          }
        }
      }

      return accum;
    }, {});
  }, [entitySummaries]);

  const entityDataStyles = useMemo(() => {
    return normalizedEntityData.reduce<StyleSettingsMap>((accum, entity) => {
      if (entitySummaries) {
        const { entityId, properties } = entity;
        const entitySummary = entitySummaries[entityId];

        if (entitySummary) {
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
  }, [entitySummaries]);

  const lineChartElement = useMemo(() => {
    return dataHistoryQuery.length
      ? dataHistoryQuery.map((query) => {
          return (
            <LineChart
              axis={{ showX: true, showY: true }}
              key={crypto.randomUUID()}
              queries={[query]}
              styles={entityDataStyles}
            />
          );
        })
      : null;
  }, [dataHistoryQuery, entityAlarmStyles]);

  const statusTimelineElement = useMemo(() => {
    return alarmHistoryQuery.length ? (
      <StatusTimeline
        key={crypto.randomUUID()}
        queries={alarmHistoryQuery}
        thresholds={ALARM_THRESHOLDS}
        styles={entityAlarmStyles}
      />
    ) : null;
  }, [alarmHistoryQuery, entityAlarmStyles]);

  return (
    <main
      className={createClassName(css.root, className, { [css.multi]: selectedEntity.entityData !== null })}
      ref={chartContainerRef}
    >
      <TimeSync initialViewport={VIEWPORT}>
        <div className={css.name}>{selectedEntity.entityData ? ALARM_STATUS_TEXT : ALL_COMPONENTS_TEXT}</div>
        {statusTimelineElement}
        {selectedEntity.entityData && lineChartElement && (
          <>
            <div className={css.name}>{PROPERTY_DETAIL_TEXT}</div>
            {lineChartElement}
          </>
        )}
      </TimeSync>
    </main>
  );
}
