import { AppLayout } from '@/lib/components/layouts';
import { useViewState } from '@/lib/state';
import { createClassName, type ClassName } from '@/lib/utils/element';
import { VIEWS } from '@/lib/views';

import styles from './styles.module.css';

export function AppView({ className }: { className?: ClassName }) {
  const [viewId] = useViewState();

  const viewElement = viewId ? VIEWS[viewId]?.content : null;

  return (
    <main className={createClassName(styles.root, className)}>
      <AppLayout>{viewElement}</AppLayout>
    </main>
  );
}
