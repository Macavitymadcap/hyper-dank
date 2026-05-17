export type UserRole = "user" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  banned?: boolean;
}

export interface AuthSession {
  user: AuthUser;
}

export interface CreateAuthUserInput {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthProvider {
  handler(request: Request): Promise<Response>;
  getSession(request: Request): Promise<AuthSession | null>;
  signIn(input: SignInInput, request: Request): Promise<Response>;
  signOut(request: Request): Promise<Response>;
  createUser(input: CreateAuthUserInput): Promise<AuthUser>;
  listUsers(): Promise<AuthUser[]>;
  countUsers(): Promise<number>;
  setUserRole(userId: string, role: UserRole): Promise<void>;
  setUserBanned(userId: string, banned: boolean): Promise<void>;
}

export interface InvitationEmailInput {
  to: string;
  inviteUrl: string;
}

export interface EmailSender {
  sendInvitation(input: InvitationEmailInput): Promise<void>;
}
