import { createClassName, type ClassName } from '@/lib/utils/element';

import baseStyles from '../styles.module.css';

export function Circle({ className }: { className?: ClassName }) {
  return (
    <svg className={createClassName(baseStyles.svg, className)} viewBox="0 0 10 10">
      <circle cx={5} cy={5} r={5} />
    </svg>
  );
}
