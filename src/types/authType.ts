export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface UserData {
  name: string;
  email: string;

}

export interface NewUserData extends UserData {
  password: string;
}
