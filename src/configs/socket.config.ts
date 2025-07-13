import { Server } from "socket.io";
import http from "http";
import constants from "../constants.js";

export default function initSocket(server: http.Server) {
    return new Server(server, { cors: { origin: constants.FRONTEND_URL } });
}
