// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. 2023
// SPDX-License-Identifier: Apache-2.0

import { VideoPlayer } from '@iot-app-kit/react-components';
import { useMemo, type ReactNode } from 'react';

import { createClassName, type ClassName } from '@/lib/core/utils/element';
import { useDataSourceStore } from '@/lib/stores/iottwinmaker';

import styles from './styles.module.css';

export function VideoPanel({ children, className }: { children?: ReactNode; className?: ClassName }) {
  const [dataSource] = useDataSourceStore();

  const player = useMemo(() => {
    if (dataSource) {
      const videoData = dataSource.videoData({
        entityId: 'ed6ee472-c43e-402d-8d17-78ff2130f046',
        componentName: 'KVS-TEST',
        kvsStreamName: 'KVS-twin-stream'
      });

      return <VideoPlayer videoData={videoData} viewport={{ duration: '0' }} />;
    }

    return null;
  }, [dataSource]);

  return (
    <main className={createClassName(styles.root, className)}>
      <div className={styles.video}>{player}</div>
    </main>
  );
}
