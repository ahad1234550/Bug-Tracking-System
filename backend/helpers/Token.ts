import jsonwebtoken from "jsonwebtoken";
import config from "config";
import { Response, Request } from "express";

const maxAgeWeek : number = 7 * 24 * 60 * 60 * 1000;

type Role = "manager" | "qa" | "developer";

export class Token{
  static accessToken(res: Response,id: number, role: Role){
    const token = jsonwebtoken.sign({
      id: id,
      role: role
    }, config.secretKey, {
      expiresIn: config.timeouts.login
    })

    Token.setCookie(res, "accessToken", token, maxAgeWeek);

    return token;

  }

  static refreshToken(res: Response, id: number, role:Role){
    const token = jsonwebtoken.sign({
      id: id,
      role: role
    }, config.secretKey, {
      expiresIn: config.timeouts.refreshToken
    })

    Token.setCookie(res, "refreshToken", token, maxAgeWeek);

    return token;
  }

  static setCookie(res: Response, name: string, value: string, maxAgeInMS: number): void{
    res.cookie(name,value, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: maxAgeInMS
    })
  }

  static getCookie(req: Request,name: string): string | null{
    return (req as any).cookies?.[name];
  }

  static deleteCookie(res: Response,name: string): void {
    res.cookie(name, "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 0
    })
  }


}