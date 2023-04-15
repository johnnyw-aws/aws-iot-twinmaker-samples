import { useMemo, useState } from 'react';

import { useDataSourceState } from '@/lib/state';
import type { TimeSeriesDataQuery, TwinMakerEntityHistoryQuery } from '@/lib/types';

export function useTimeSeriesDataQuery(
  initialEntityHistoryQuery: TwinMakerEntityHistoryQuery[] = []
): [TimeSeriesDataQuery[], React.Dispatch<React.SetStateAction<TwinMakerEntityHistoryQuery[]>>] {
  const [dataSource] = useDataSourceState();
  const [entityHistoryQuery, setEntityHistoryQuery] =
    useState<TwinMakerEntityHistoryQuery[]>(initialEntityHistoryQuery);

  const timeSeriesQuery = useMemo<TimeSeriesDataQuery[]>(() => {
    if (dataSource && entityHistoryQuery.length) {
      return entityHistoryQuery.map((query) => dataSource.query.timeSeriesData(query));
    }
    return [];
  }, [dataSource, entityHistoryQuery]);

  return [timeSeriesQuery, setEntityHistoryQuery];
}
