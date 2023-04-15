import { LineChart as Chart } from '@iot-app-kit/react-components';
import type { Except } from 'type-fest';

import { BaseChart, type BaseChartProps } from '@/lib/components/charts';

export function LineChart(props: Except<BaseChartProps, 'ChartComponent'>) {
  return <BaseChart {...props} ChartComponent={Chart} />;
}
