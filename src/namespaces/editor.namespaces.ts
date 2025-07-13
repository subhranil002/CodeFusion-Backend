import { Server } from "socket.io";
import CustomSocket from "../types/socket.js";
import editorSockets from "../sockets/editor.sockets.js";

function editorNamespaces(io: Server) {
    const editorNamespace = io.of("/editor");
    editorNamespace.on("connection", (socket: CustomSocket) => {
        editorSockets(socket, editorNamespace);
    });
}

export default editorNamespaces;
