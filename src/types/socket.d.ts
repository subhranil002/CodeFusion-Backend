import { Socket } from "socket.io";

export default interface CustomSocket extends Socket {
    userId?: string;
}
