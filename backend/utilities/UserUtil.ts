import { ErrorCodes, UserConstants } from "../constants";
import { Exception, Validators } from "../helpers";

interface User {
    id: number,
    email: string,
    name: string,
    password: string,
    role: string,
    number: string
}

interface UpdateProfile {
    number: string
}

export class UserUtil {
    static UserExistCheck(data: User | null): void {
        if (!data) {
            console.log(`User Does Not Exist. user:: `, data);
            throw new Exception(UserConstants.MESSAGES.USER_DOES_NOT_EXIST, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
        }
    }
    static UpdateProfileCheck(data: UpdateProfile | null): void {
        if (!data || !data.number) {
            console.log("Data is missing");
            throw new Exception(UserConstants.MESSAGES.INVALID_DATA_TO_UPDATE_PROFILE, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
        }
        if (!Validators.isValidPhoneNumber(data.number)) {
            console.log("Wrong Phone Number Format");
            throw new Exception(UserConstants.MESSAGES.INVALID_PHONE_NUMBER, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

        }
    }
}