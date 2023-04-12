import type { Threshold, ThresholdValue } from '@iot-app-kit/core';
import { StatusTimeline, WebglContext } from '@iot-app-kit/react-components';

import { useAppKitQueries } from '@/lib/hooks';
import { entityQueries, viewport } from '@/lib/iottwinmaker';
import { createClassName, type ClassName } from '@/lib/utils/element';

import '@iot-app-kit/react-components/styles.css';
import styles from './styles.module.css';

export function DashboardPanel({ className }: { className?: ClassName }) {
  const queries = useAppKitQueries(entityQueries);

  const thresholds: Threshold<ThresholdValue>[] = [
    {
      color: '#d13212',
      value: 'ACTIVE',
      comparisonOperator: 'EQ'
    },
    {
      color: '#ff9900',
      value: 'WARNING',
      comparisonOperator: 'EQ'
    },
    {
      color: '#1d8102',
      value: 'NORMAL',
      comparisonOperator: 'EQ'
    }
  ];

  return (
    <main className={createClassName(styles.root, className)}>
      <StatusTimeline viewport={viewport} queries={queries} thresholds={thresholds} />
      <WebglContext />
    </main>
  );
}
