import type { LineChart as Chart } from '@iot-app-kit/react-components';
import { useEffect, useMemo, type FunctionComponent } from 'react';
import type { Except } from 'type-fest';

import { useTimeSeriesDataQuery } from '@/lib/hooks';
import type { TwinMakerEntityHistoryQuery } from '@/lib/types';
import { createClassName, type ClassName } from '@/lib/utils/element';

import css from './styles.module.css';

export type BaseChartProps = {
  ChartComponent: FunctionComponent<ChartComponentProps>;
  className?: ClassName;
  queries: TwinMakerEntityHistoryQuery[];
} & Partial<Except<Parameters<typeof Chart>[0], 'queries'>>;

type ChartComponentProps = Parameters<typeof Chart>[0];

export function BaseChart({ axis, ChartComponent, className, queries, styles, thresholds }: BaseChartProps) {
  const [_queries, setQuery] = useTimeSeriesDataQuery(queries);

  useEffect(() => setQuery(queries), [queries]);

  // const element = useMemo(() => {
  //   return (
  //     <ChartComponent
  //       key={crypto.randomUUID()}
  //       axis={axis}
  //       queries={_queries}
  //       thresholds={thresholds}
  //       styles={styles}
  //     />
  //   );
  // }, [axis, ChartComponent, className, _queries, styles, thresholds]);

  return (
    <section className={createClassName(css.root, className)}>
      <ChartComponent
        key={crypto.randomUUID()}
        axis={axis}
        queries={_queries}
        thresholds={thresholds}
        styles={styles}
      />
    </section>
  );
}
