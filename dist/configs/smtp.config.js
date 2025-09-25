import { google } from "googleapis";
import constants from "../constants.js";
const oauth2Client = new google.auth.OAuth2(constants.GOOGLE_CLIENT_ID, constants.GOOGLE_CLIENT_SECRET);
oauth2Client.setCredentials({ refresh_token: constants.GOOGLE_REFRESH_TOKEN });
export default oauth2Client;
