import type { ReactNode } from 'react';

import { BodyLayout, HeaderLayout } from '@/lib/components/layouts';
import { createClassName, type ClassName } from '@/lib/utils/element';

import styles from './styles.module.css';

export function AppLayout({ className, children }: { className?: ClassName; children?: ReactNode }) {
  return (
    <main className={createClassName(styles.root, className)}>
      <HeaderLayout />
      <BodyLayout>{children}</BodyLayout>
    </main>
  );
}
