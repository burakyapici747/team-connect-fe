export interface UserPrivateOutput {
  id: string;
  email: string;
  username: string;
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
