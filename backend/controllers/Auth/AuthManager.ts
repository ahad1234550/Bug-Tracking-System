import { Request, Response } from "express";
import { UserHandler } from "../../handlers/UserHandler";
import { Token } from "../../helpers";
import { AuthUtil } from "../../utilities/AuthUtil";
import { dataAfterLogIn, signUpData } from "../../interface/Auth";
import { user } from "../../interface/User";



export default class AuthManager {
  static async signup(data: signUpData): Promise<user> {
    AuthUtil.signUpDataCheck(data);

    let user = await UserHandler.findUserByEmail(data.email);
    AuthUtil.emailExistCheck(user);

    data.password = await AuthUtil.hashPassword(data.password);

    user = await UserHandler.signUpUser(data);
    return user;
  }

  static async login(req: Request, res: Response): Promise<dataAfterLogIn> {
    const data = req.body;

    AuthUtil.logInDataCheck(data);

    let user = await UserHandler.findUserByEmail(data.email);
    AuthUtil.emailExistCheckLogin(user);

    await AuthUtil.passwordCompare(data.password, user.password);

    const setAccessToken = Token.accessToken(res, user.id, user.role);
    const setRefreshToken = Token.refreshToken(res, user.id, user.role);

    const userWithToken: dataAfterLogIn = {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      number: user.number,
      role: user.role,
      setaccessToken: setAccessToken,
      setrefreshToken: setRefreshToken
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
