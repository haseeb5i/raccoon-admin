export interface LoginType {
  apiKey: string;
}

export interface LoginData {
  accessToken: string;
  user: {
    id: string;
    email: string;
    password: string;
  };
}

export interface UserData {
  name: string;
  email: string;
  password: string;
  id: string;
}

export interface RegisterType {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
