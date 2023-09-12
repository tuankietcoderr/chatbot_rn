export interface IUser {
  _id?: string;
  username: string;
  password?: string;
  fullName?: string;
  email: string;
  is_email_verified: boolean;
}
