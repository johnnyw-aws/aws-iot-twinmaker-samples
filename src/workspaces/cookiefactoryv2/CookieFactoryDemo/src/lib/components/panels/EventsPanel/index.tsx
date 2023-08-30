// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. 2023
// SPDX-License-Identifier: Apache-2.0

import { formatDuration, intervalToDuration } from 'date-fns';
import { useMemo, useState } from 'react';

import { AlarmHighIcon, AlarmMediumIcon, AlarmLowIcon, SuccessIcon } from '@/lib/components/svgs/icons';
import { createClassName, type ClassName } from '@/lib/core/utils/element';
import { getRelativeTimeString } from '@/lib/core/utils/time';
import { selectedStore } from '@/lib/stores/entity';
import { useSelectedStore } from '@/lib/stores/entity';
import { useAllEvents } from '@/lib/stores/event';
import type { Event, EventState, EventStatus } from '@/lib/types';

import styles from './styles.module.css';
import { isNil } from '@/lib/core/utils/lang';

type EventFilter = EventState | EventStatus | null;

const LABELS = {
  Detected: 'Detected',
  Lasted: 'Lasted'
};

export function EventsPanel({ className }: { className?: ClassName }) {
  const allEvents = useAllEvents();
  const [selectedEntity] = useSelectedStore();
  const [filter, setFilter] = useState<EventFilter | null>(null);

  const events = useMemo(() => {
    return allEvents
      .filter(({ state, status }) => {
        return filter ? state === filter || status === filter : true;
      })
      .filter(({ entityData: { entityId } }) => {
        return selectedEntity.entityData ? selectedEntity.entityData.entityId === entityId : true;
      })
      .map((event) => {
        return (
          <button
            className={createClassName(styles.event, styles[event.state])}
            data-active={event.status !== 'resolved'}
            key={event.id}
            onPointerUp={() => selectedStore.setState({ entityData: event.entityData, type: null })}
          >
            <section className={styles.body}>
              <div className={styles.icon}>{getIcon(event)}</div>
              <div className={styles.content}>
                <div className={styles.entityName}>{event.entityData.name}</div>
                <div className={styles.name}>{event.name}</div>
                <div className={styles.message}>{event.message}</div>
              </div>
            </section>
            <section className={styles.footer}>
              <span>{event.status}</span>
              <span data-label={LABELS.Detected}>
                {getRelativeTimeString(event.lastModififedTimestamp, { numeric: 'auto', style: 'narrow' })}
              </span>
              {event.status === 'resolved' && (
                <span data-label={LABELS.Lasted}>
                  {formatDuration(
                    intervalToDuration({ start: event.lastModififedTimestamp, end: event.createdTimestamp }),
                    { format: ['days', 'hours', 'minutes', 'seconds'] }
                  )}
                </span>
              )}
            </section>
          </button>
        );
      });
  }, [allEvents, filter, selectedEntity]);

  const filteredCounts = useMemo(() => {
    const filteredEvents = allEvents.filter(({ entityData: { entityId } }) =>
      selectedEntity.entityData?.entityId ? entityId === selectedEntity.entityData?.entityId : true
    );

    return {
      high: filteredEvents.filter(({ state }) => state === 'High').length,
      medium: filteredEvents.filter(({ state }) => state === 'Medium').length,
      low: filteredEvents.filter(({ state }) => state === 'Low').length,
      resolved: filteredEvents.filter(({ status }) => status === 'resolved').length
    };
  }, [allEvents, selectedEntity]);

  return (
    <main className={createClassName(styles.root, className)} data-has-event={events.length > 0}>
      <section className={styles.controls}>
        <div className={styles.filterMessage}>{getFilterMessage(filter)}</div>
        <div className={styles.alarmControls}>
          <button
            className={styles.alarmControl}
            data-active={isNil(filter) || filter === 'High'}
            onPointerUp={() =>
              setFilter((state) => {
                if (state === 'High') return null;
                return 'High';
              })
            }
          >
            <AlarmHighIcon className={createClassName(styles.alarmControlIcon, styles.alarmIconHigh)} />
            <span>{filteredCounts.high}</span>
          </button>
          <button
            className={styles.alarmControl}
            data-active={isNil(filter) || filter === 'Medium'}
            onPointerUp={() =>
              setFilter((state) => {
                if (state === 'Medium') return null;
                return 'Medium';
              })
            }
          >
            <AlarmMediumIcon className={createClassName(styles.alarmControlIcon, styles.alarmIconMedium)} />
            <span>{filteredCounts.medium}</span>
          </button>
          <button
            className={styles.alarmControl}
            data-active={isNil(filter) || filter === 'Low'}
            onPointerUp={() =>
              setFilter((state) => {
                if (state === 'Low') return null;
                return 'Low';
              })
            }
          >
            <AlarmLowIcon className={createClassName(styles.alarmControlIcon, styles.alarmIconLow)} />
            <span>{filteredCounts.low}</span>
          </button>
          <button
            className={styles.alarmControl}
            data-active={isNil(filter) || filter === 'resolved'}
            onPointerUp={() =>
              setFilter((state) => {
                if (state === 'resolved') return null;
                return 'resolved';
              })
            }
          >
            <SuccessIcon className={createClassName(styles.alarmControlIcon, styles.alarmIconResolved)} />
            <span>{filteredCounts.resolved}</span>
          </button>
        </div>
      </section>

      {events.length ? (
        <section className={styles.events}>
          <div className={styles.eventList}>{events}</div>
        </section>
      ) : (
        <section className={styles.emptyState}>
          <h1>You&#8217;re all caught up!</h1>
          <section>No events available</section>
        </section>
      )}
    </main>
  );
}

function getFilterMessage(filter: EventFilter) {
  switch (filter) {
    case 'High':
      return 'High priority events';
    case 'Medium':
      return 'Medium priority events';
    case 'Low':
      return 'Low priority events';
    case 'resolved':
      return 'Resolved events';
    default:
      return 'All events';
  }
}

function getIcon(event: Event) {
  if (event.status === 'resolved') return <SuccessIcon />;

  switch (event.state) {
    case 'High':
      return <AlarmHighIcon />;

    case 'Medium':
      return <AlarmMediumIcon />;

    case 'Low':
      return <AlarmLowIcon />;

    default:
      return <SuccessIcon />;
  }
}

// const SECOND = 1000;
// const MINUTE = SECOND * 60;
// const HOUR = MINUTE * 60;
// const DAY = HOUR * 24;

// function formatDuration(duration: number) {
//   const days = Math.floor(duration / DAY);
//   const hours = Math.floor(duration / HOUR);
//   const minutes = Math.floor(duration / MINUTE) / hours;
// }
