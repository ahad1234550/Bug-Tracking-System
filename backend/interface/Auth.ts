export interface signUpData {
  email: string;
  name: string;
  password: string;
  confirm_password: string;
  number: string;
  role: "manager" | "qa" | "developer";
}

export interface dataAfterLogIn {
  id: number;
  email: string;
  name: string;
  password: string;
  number: string;
  role: "manager" | "qa" | "developer";
  setaccessToken: string;
  setrefreshToken: string;
}