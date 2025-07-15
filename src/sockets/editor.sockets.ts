import { Namespace } from "socket.io";
import CustomSocket from "../types/socket.js";

type User = {
    name: string;
    isTyping: boolean;
};

const rooms = new Map<string, Set<User>>();

function editorSockets(socket: CustomSocket, editorNamespace: Namespace) {
    let currentRoom: string | null = null;
    let currentUser: string | null = null;

    function leaveRoom(roomId: string, userName: string) {
        socket.leave(roomId);

        const userSet = rooms.get(roomId);
        if (userSet) {
            for (const u of userSet) {
                if (u.name === userName) {
                    userSet.delete(u);
                    break;
                }
            }
        }

        editorNamespace
            .to(roomId)
            .emit("userLeft", {
                userName,
                users: Array.from(rooms.get(roomId)!),
            });

        currentRoom = null;
        currentUser = null;
    }

    socket.on(
        "verifyUniqueUser",
        ({ roomId, userName }: { roomId: string; userName: string }) => {
            let unique = true;
            if (!rooms.has(roomId) || rooms.get(roomId)!.size === 0) {
                editorNamespace.to(socket.id).emit("uniqueUser", {
                    unique,
                    roomId,
                    userName,
                });
            } else {
                const userSet = rooms.get(roomId)!;
                for (const u of userSet) {
                    if (u.name === userName) {
                        unique = false;
                        break;
                    }
                }
                editorNamespace.to(socket.id).emit("uniqueUser", {
                    unique,
                    roomId,
                    userName,
                });
            }
        }
    );

    socket.on(
        "join",
        ({ roomId, userName }: { roomId: string; userName: string }) => {
            if (currentRoom && currentUser) {
                leaveRoom(currentRoom, currentUser);
            }

            currentRoom = roomId;
            currentUser = userName;
            socket.join(roomId);

            if (!rooms.has(roomId)) {
                rooms.set(
                    roomId,
                    new Set<User>([{ name: userName, isTyping: false }])
                );
            } else {
                rooms.get(roomId)!.add({ name: userName, isTyping: false });
            }

            editorNamespace.to(roomId).emit("userJoined", {
                userName,
                users: Array.from(rooms.get(roomId)!),
            });
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

    socket.on("typing", () => {
        const userSet = rooms.get(currentRoom!);
        if (userSet) {
            for (const u of userSet) {
                if (u.name === currentUser) {
                    u.isTyping = true;
                }
            }
            editorNamespace.to(currentRoom!).emit("userTyping", {
                userName: currentUser,
                users: Array.from(userSet),
            });
        }
    });

    socket.on("languageChange", ({ roomId, language }) => {
        socket.to(roomId).emit("languageUpdate", language);
    });

    socket.on("disconnect", () => {
        if (currentRoom && currentUser) {
            leaveRoom(currentRoom, currentUser);
        }
    });
}

export default editorSockets;
