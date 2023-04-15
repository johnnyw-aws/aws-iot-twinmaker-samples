import { useTimeSeriesData } from '@iot-app-kit/react-components';

import { VIEWPORT } from '@/config/iottwinmaker';
import { timeSeriesDataState } from '@/lib/state';
import type { TimeSeriesDataQuery } from '@/lib/types';

import { useEffect } from 'react';

export function TimeSeriesDataProvider({ queries }: { queries: TimeSeriesDataQuery[] }) {
  const { dataStreams } = useTimeSeriesData({ queries, viewport: VIEWPORT });
  useEffect(() => timeSeriesDataState.setState(dataStreams), [dataStreams]);
  return null;
}
