import { LoginProvider } from '@app/users/schema/user.schema';

export class TokenPayload {
  username: string;
  email: string;
  givenName: string;
  surname: string;
  sub: string;
  roles: string[];
  isVerified: boolean;
  isActivated: boolean;
  isCompleted: boolean;
  loginProvider: LoginProvider;
  profilePictureUrl: string;
  permissions: string[];
}
