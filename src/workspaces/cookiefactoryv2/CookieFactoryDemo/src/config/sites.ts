import type { SiteConfig } from '@/lib/types';

export const WORKSPACE_ID = 'CFv2OneClick230308';

const sites: SiteConfig[] = [
  {
    awsConfig: {
      sceneId: 'CookieFactory',
      workspaceId: WORKSPACE_ID
    },
    id: crypto.randomUUID(),
    location: '1 Main Street, Bakersville, NC, USA',
    name: 'Bakersville Central'
  },
  {
    awsConfig: {
      sceneId: 'CookieFactory',
      workspaceId: WORKSPACE_ID
    },
    id: crypto.randomUUID(),
    location: '130 Cookie Lane North, Bakersville, NC, USA',
    name: 'Bakersville North'
  },
  {
    awsConfig: {
      sceneId: 'CookieFactory',
      workspaceId: WORKSPACE_ID
    },
    id: crypto.randomUUID(),
    location: '500 Cookie Lane South, Bakersville, NC, USA',
    name: 'Bakersville South'
  }
];

export default sites;
