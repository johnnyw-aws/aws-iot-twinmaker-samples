import { createClassName, type ClassName } from '@/lib/utils/element';

import baseStyles from '../styles.module.css';

export function ArrowHeadDownIcon({ className }: { className?: ClassName }) {
  return (
    <svg className={createClassName(baseStyles.svg, className)} viewBox="0 0 16 10">
      <path d="M8 9.887.862 2.762 2.637.987 8 6.362 13.362.987l1.775 1.775L8 9.887Z" />
    </svg>
  );
}
