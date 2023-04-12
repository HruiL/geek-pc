declare module "user" {
  export interface User {
    id: string;
    name: string;
    photo: string;
    mobile: string;
    gender: "0" | "1";
    birthday: string;
  }
}
