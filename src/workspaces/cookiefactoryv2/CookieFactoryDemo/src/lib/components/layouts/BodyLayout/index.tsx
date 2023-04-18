import type { ReactNode } from 'react';

import { createClassName, type ClassName } from '@/lib/utils/element';

import styles from './styles.module.css';

export function BodyLayout({ children, className }: { children: ReactNode; className?: ClassName }) {
  return <main className={createClassName(styles.root, className)}>{children}</main>;
}
