import { AppView, PersonaSelectorView, SiteSelectorView } from './lib/components/views';
import { useSiteState, useUserState } from '@/lib/state';
import { isNil } from './lib/utils/lang';

import appStyles from './app.module.css';

export function App() {
  const [user] = useUserState();
  const [site] = useSiteState();

  return (
    <main className={appStyles.root}>
      {isNil(user) ? <PersonaSelectorView /> : isNil(site) ? <SiteSelectorView /> : <AppView />}
    </main>
  );
}
