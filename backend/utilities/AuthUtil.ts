import { ErrorCodes, UserConstants } from "../constants";
import { bcrypt, Exception, Validators } from "../helpers";

interface SignUpData {
    email: string,
    name: string,
    password: string,
    confirm_password: string,
    role: string,
    number: string
}

interface User {
    id: number,
    email: string,
    name: string,
    password: string,
    role: string,
    number: string
}

interface LogInData {
    email: string,
    password: string
}
export class AuthUtil {
    static signUpDataCheck(data: SignUpData): void {
        if ((!data || !data.email || !data.password || !data.number || !data.confirm_password || !data.name)) {
            console.log("Data is missing");
            throw new Exception(UserConstants.MESSAGES.INVALID_DATA_TO_SIGNUP_USER, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
        }

        if (!Validators.isValidateEmail(data.email)) {
            console.log("Wrong Email Format");
            throw new Exception(UserConstants.MESSAGES.INVALID_EMAIL, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
        }

        if (!Validators.isValidName(data.name)) {
            console.log("Wrong Name Format");
            throw new Exception(UserConstants.MESSAGES.INVALID_NAME, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
        }

        if (!Validators.isValidPassword(data.password)) {
            console.log("Wrong Password Format");
            throw new Exception(UserConstants.MESSAGES.INVALID_PASSWORD, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
        }

        if (!Validators.isValidPasswordCheck(data.password, data.confirm_password)) {
            console.log("Password did not matched with confirm password");
            throw new Exception(UserConstants.MESSAGES.PASSWORD_NOT_MATCHED_WITH_CONFIRM, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
        }

        if (!Validators.isValidRole(data.role)) {
            console.log("Wrong Role");
            throw new Exception(UserConstants.MESSAGES.INVALID_ROLE, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
        }

        if (!Validators.isValidPhoneNumber(data.number)) {
            console.log("Wrong Phone Number Format");
            throw new Exception(UserConstants.MESSAGES.INVALID_PHONE_NUMBER, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

        }
    }

    static emailExistCheck(user: User): void {
        if (user) {
            console.log(`validateUserForSignUp:: User already exist against this email. user:: `, user);

            throw new Exception(UserConstants.MESSAGES.USER_ALREADY_EXIST, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
        }
    }

    static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    static logInDataCheck(data: LogInData): void {
        if (!data || !data.email || !data.password) {
            console.log("Data is missing");
            throw new Exception(UserConstants.MESSAGES.INVALID_DATA_TO_LOGIN, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
        }
    }

    static emailExistCheckLogin(data: User | null): void {
        if (!data) {
            console.log(`User Does Not Exist. user:: `, data);
            throw new Exception(UserConstants.MESSAGES.USER_DOES_NOT_EXIST, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
        }
    }

    static async PasswordCompare(password: string, enteredPassword: string): Promise<void> {
        const passwordCheck = await bcrypt.compare(password, enteredPassword);
        if (!passwordCheck) {
            console.log("login:: Password does not match.");
            throw new Exception(UserConstants.MESSAGES.PASSWORD_DOES_NOT_MATCH, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();
        }
    }
}