import type { CognitoAuthenticatedFlowConfig } from '@/lib/authentication';

/**
 * AWS Cognito authenticated flow configuration.
 * RENAME THIS TEMPLATE TO `cognito.ts`
 */
const cognito: CognitoAuthenticatedFlowConfig = {
  clientId: '1i5q7fjgtfbcv6uc4gvhlmb40t',
  identityPoolId: 'us-east-1:b9dfca73-1ead-49fa-a8e3-7f47558dc462',
  region: 'us-east-1',
  userPoolId: 'us-east-1_OEuHnLn9D'
};

export default cognito;
