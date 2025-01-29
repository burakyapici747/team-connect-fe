export interface UserPrivateOutput {
  id: string;
  username: string;
  email: string;
  token: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPublicOutput {
  id: string;
  email: string;
  username: string;
}

export interface Author {
  id: string;
  username: string;
  avatarFileId: string;
  avatarFileUrl: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
