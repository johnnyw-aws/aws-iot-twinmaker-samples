import { CookieFactoryLogoWide } from '@/lib/components/svgs/logos';
import { createClassName, type ClassName } from '@/lib/utils/element';

import styles from './styles.module.css';

export function Logo({ className }: { className?: ClassName }) {
  return <CookieFactoryLogoWide className={createClassName(styles.root, className)} />;
}
