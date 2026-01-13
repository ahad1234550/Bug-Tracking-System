import { ErrorCodes, UserConstants } from "../constants";
import { Exception, Validators } from "../helpers";
import { updateProfile, user } from "../interface/User";

export class UserUtil {
    static userExistCheck(data: user | null): void {
        if (!data) {
            console.log(`User Does Not Exist. user:: `, data);
            throw new Exception(UserConstants.MESSAGES.USER_DOES_NOT_EXIST, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
        }
    }
    static updateProfileCheck(data: updateProfile | null): void {
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