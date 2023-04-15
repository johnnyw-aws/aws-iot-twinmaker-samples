import type { UserConfig } from '@/lib/types';

/**
 * Authenticated user configuration.
 * RENAME THIS TEMPLATE TO `users.ts`
 * @proprety `email` AWS Cognito user account credential
 * @proprety `password` AWS Cognito user account credential
 */
const users: UserConfig[] = [
  {
    email: '',
    firstName: '',
    lastName: '',
    title: '',
    password: ''
  }
];

export default users;
