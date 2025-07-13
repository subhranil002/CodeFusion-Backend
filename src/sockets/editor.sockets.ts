import { Namespace } from "socket.io";
import CustomSocket from "../types/socket.js";

const rooms = new Map<string, Set<string>>();

function editorSockets(socket: CustomSocket, editorNamespace: Namespace) {
    let currentRoom: string | null;
    let currentUser: string | null;

    function leaveRoom(roomId: string, userName: string) {
        socket.leave(roomId);
        rooms.get(roomId)?.delete(userName);
        editorNamespace
            .to(roomId)
            .emit("userJoined", Array.from(rooms.get(userName) ?? []));
        currentRoom = null;
        currentUser = null;
    }

    socket.on(
        "join",
        ({ roomId, userName }: { roomId: string; userName: string }) => {
            if (currentRoom) {
                leaveRoom(currentRoom, userName);
            }

            currentRoom = roomId;
            currentUser = userName;

            socket.join(roomId);

            if (!rooms.has(roomId)) {
                rooms.set(roomId, new Set(userName));
            }

            editorNamespace
                .to(roomId)
                .emit("userJoined", Array.from(rooms.get(currentRoom) ?? []));
        }
    );

    socket.on("codeChange", ({ roomId, code }) => {
        socket.to(roomId).emit("codeUpdate", code);
    });

    socket.on("leaveRoom", ({ userName }: { userName: string }) => {
        if (currentRoom) {
            leaveRoom(currentRoom, userName);
        }
    });

    socket.on("typing", ({ roomId, userName }) => {
        socket.to(roomId).emit("userTyping", userName);
    });

    socket.on("languageChange", ({ roomId, language }) => {
        socket.to(roomId).emit("languageUpdate", language);
    });

    socket.on("disconnect", () => {
        leaveRoom(currentRoom!, currentUser!);
    });
}

export default editorSockets;
