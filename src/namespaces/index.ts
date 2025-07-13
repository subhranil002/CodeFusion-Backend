import { Server } from "socket.io";
import editorNamespaces from "./editor.namespaces.js";

function namespaces(io: Server) {
    editorNamespaces(io);
}

export default namespaces;