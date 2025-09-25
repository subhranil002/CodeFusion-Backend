import editorSockets from "../sockets/editor.sockets.js";
function editorNamespaces(io) {
    const editorNamespace = io.of("/editor");
    editorNamespace.on("connection", (socket) => {
        editorSockets(socket, editorNamespace);
    });
}
export default editorNamespaces;
