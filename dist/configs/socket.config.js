import { Server } from "socket.io";
import constants from "../constants.js";
export default function initSocket(server) {
    return new Server(server, {
        cors: { origin: constants.FRONTEND_URL },
    });
}
