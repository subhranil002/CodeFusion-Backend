import { userDocument } from "../../models/user.model.ts";

declare global {
    namespace Express {
        interface Request {
            user?: userDocument;
        }
    }
}
