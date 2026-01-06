import { Request, Response } from "express";
import { UserHandler } from "../../handlers/UserHandler";
import { Token } from "../../helpers";
import { AuthUtil } from "../../utilities/AuthUtil";

interface SignUpData {
  email: string;
  name: string;
  password: string;
  confirm_password: string;
  number: string;
  role: "manager" | "qa" | "developer";
}

interface UserData {
  id: number;
  email: string;
  name: string;
  password: string;
  number: string;
  role: "manager" | "qa" | "developer";
}

interface LogInData {
  email: string;
  password: string;
}

interface DataAfterLogIn {
  id: number;
  email: string;
  name: string;
  password: string;
  number: string;
  role: "manager" | "qa" | "developer";
  setaccessToken: string;
  setrefreshToken: string;
  getaccessToken: string | "";
  getrefreshToken: string | "";
}

export default class AuthManager {
  static async signup(data: SignUpData): Promise<UserData> {
    AuthUtil.signUpDataCheck(data);

    let user = await UserHandler.FindUserByEmail(data.email);
    AuthUtil.emailExistCheck(user);

    data.password = await AuthUtil.hashPassword(data.password);

    user = await UserHandler.SignUpUser(data);
    return user;
  }

  static async login(req: Request, res: Response): Promise<DataAfterLogIn> {
    const data = req.body;

    AuthUtil.logInDataCheck(data);

    let user = await UserHandler.FindUserByEmail(data.email);
    AuthUtil.emailExistCheckLogin(user);

    await AuthUtil.PasswordCompare(data.password, user.password);

    const setAccessToken = Token.accessToken(res, user.id, user.role);
    const setRefreshToken = Token.refreshToken(res, user.id, user.role);

    const getAccessToken = Token.getCookie(req, "accessToken");
    const getRefreshToken = Token.getCookie(req, "refreshToken");

    const userWithToken: DataAfterLogIn = {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      number: user.number,
      role: user.role,
      setaccessToken: setAccessToken,
      setrefreshToken: setRefreshToken,
      getaccessToken: getAccessToken || "",
      getrefreshToken: getRefreshToken || ""
    };

    return userWithToken;
  }

  static logout(req: Request, res: Response) : string | null 
  {
    Token.deleteCookie(res, "accessToken");
    Token.deleteCookie(res, "refreshToken");
    return Token.getCookie(req, "refreshToken")
  }
}
