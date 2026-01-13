import fs from "fs";
import multer from "multer";
import path from "path";
import { ProjectUtil } from "../utilities/ProjectUtil";
import { Exception } from "../helpers";
import { User } from "../constants/User";
import { ErrorCodes } from "../constants";

const dir = path.join(process.cwd(), "public/uploads");

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const store = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, dir);
    },
    filename: (_req, file, cb) => {
        const newName = `${Date.now()}-${file.originalname}`;
        cb(null, newName);
    }
});

export const fileUpload = multer({
    storage: store,
    fileFilter: (_req, file, cb) => {
        if (!file) return cb(null, true);

        const typeCheck = ProjectUtil.checkImageType(file.originalname);
        if (!typeCheck) {
            const exceptionJson = new Exception(
                User.MESSAGES.INVALID_IMAGE_TYPE,
                ErrorCodes.UNSUPPORTED_MEDIA_TYPE,
                { resultError: true }
            ).toJson();

            const err = new Error(User.MESSAGES.FILE_REQUIRED) as any;
            err.code = ErrorCodes.DOCUMENT_NOT_FOUND;
            err.resultError = true;

            return cb(err, false);
        }

        cb(null, true);
    }
});
