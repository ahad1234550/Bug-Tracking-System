import fs from "fs";
import path from "path";
import { Exception } from "../helpers";
import { User } from "../constants/User";
import { ErrorCodes } from "../constants";

export class DeleteFile{
    static delete(filename: string): void{
        if(!filename){
            return;
        }
        const pathOfFile = path.join(process.cwd(),"public/uploads/",filename);

        try {
            if(fs.existsSync(pathOfFile)){
                fs.unlinkSync(pathOfFile);
            }
        } catch (error) {
            console.error("File delete failed:", error);
            throw new Exception(User.MESSAGES.FAILED_FILE_DELETE, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
        }
    }
}