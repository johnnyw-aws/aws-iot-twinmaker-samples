import { GearIcon } from '@/lib/components/svgs/icons';
import { createClassName, type ClassName } from '@/lib/utils/element';

import styles from './styles.module.css';

export function Configuration({ className }: { className?: ClassName }) {
  return (
    <section className={createClassName(styles.root, className)}>
      <GearIcon className={styles.icon} />
    </section>
  );
}
