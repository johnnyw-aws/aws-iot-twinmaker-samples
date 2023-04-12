import type { TwinMakerQuery } from '@iot-app-kit/source-iottwinmaker';
import { useMemo } from 'react';

import { useDataSourceState } from '@/lib/state';

export function useAppKitQueries(queries: TwinMakerQuery[]) {
  const [dataSource] = useDataSourceState();

  return useMemo(() => {
    return dataSource ? [...queries.map((query) => dataSource.query.timeSeriesData(query))] : [];
  }, [dataSource]);
}
