import { WebglContext } from '@iot-app-kit/react-components';

import { AppView, PersonaSelectorView, SiteSelectorView } from '@/lib/components/views';
import { panelState, usePanelState, useSiteState, useUserState } from '@/lib/state';
import { isNil } from '@/lib/utils/lang';

import styles from './app.module.css';
import { createClassName } from './lib/utils/element';

export function App() {
  const [panel] = usePanelState();
  const [site] = useSiteState();
  const [user] = useUserState();

  return (
    <main className={styles.root}>
      {isNil(user) ? <PersonaSelectorView /> : isNil(site) ? <SiteSelectorView /> : <AppView />}
      <WebglContext className={createClassName({ [styles.canvasHidden]: !panel.includes('dashboard') })} />
    </main>
  );
}
