import cognito from '@/config/cognito';
import type { AuthenticatedUserConfig } from '@/lib/authentication';

export const AWS_CREDENTIAL_CONFIG: Pick<
  AuthenticatedUserConfig,
  'clientId' | 'identityPoolId' | 'region' | 'userPoolId'
> = { ...cognito } as const;
