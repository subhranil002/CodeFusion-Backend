import { Namespace } from "socket.io";
import CustomSocket from "../types/socket.js";

type User = {
    name: string;
    isTyping: boolean;
};

const rooms = new Map<string, Map<string, User>>();

export default function editorSockets(
    socket: CustomSocket,
    editorNamespace: Namespace
) {
    socket.data.roomId = null as string | null;
    socket.data.userName = null as string | null;
    socket.data.typing = false as boolean;

    function leaveRoom() {
        const { roomId, userName } = socket.data;
        if (!roomId || !userName) return;

        socket.leave(roomId);

        const state = rooms.get(roomId);
        if (!state) return;
        state.delete(userName);

        if (state.size === 0) {
            rooms.delete(roomId);
        } else {
            socket.to(roomId).emit("userLeft", {
                userName,
                users: Array.from(state.values()),
            });
        }

        socket.data.roomId = null;
        socket.data.userName = null;
    }

    socket.once("disconnect", leaveRoom);
    socket.on("leaveRoom", leaveRoom);

    socket.on("verifyUniqueUser", ({ roomId, userName }) => {
        const state = rooms.get(roomId) ?? new Map<string, User>();
        const unique = !state.has(userName);
        editorNamespace.to(socket.id).emit("uniqueUser", {
            unique,
            roomId,
            userName,
        });
    });

    socket.on(
        "join",
        ({ roomId, userName }: { roomId: string; userName: string }) => {
            leaveRoom();

            socket.join(roomId);
            socket.data.roomId = roomId;
            socket.data.userName = userName;

            const state = rooms.get(roomId) ?? new Map<string, User>();
            state.set(userName, { name: userName, isTyping: false });
            rooms.set(roomId, state);

            editorNamespace.to(socket.id).emit("updateUsers", {
                users: Array.from(state.values()),
            });
            socket.to(roomId).emit("userJoined", {
                userName,
                users: Array.from(state.values()),
            });
        }
    );

    socket.on("startTyping", () => {
        const { roomId, userName, typing } = socket.data;
        if (!roomId || !userName || typing) return;

        socket.data.typing = true;
        const state = rooms.get(roomId)!;
        state.get(userName)!.isTyping = true;

        socket.to(roomId).emit("updateUsers", {
            users: Array.from(state.values()),
        });
    });

    socket.on("stopTyping", () => {
        const { roomId, userName, typing } = socket.data;
        if (!roomId || !userName || !typing) return;

        socket.data.typing = false;
        const state = rooms.get(roomId)!;
        state.get(userName)!.isTyping = false;

        socket.to(roomId).emit("updateUsers", {
            users: Array.from(state.values()),
        });
    });

    socket.on("codeChange", ({ code }: { code: string }) => {
        const { roomId } = socket.data;
        if (!roomId) return;
        socket.to(roomId).emit("codeUpdate", code);
    });

    socket.on("languageChange", ({ language }: { language: string }) => {
        const { roomId } = socket.data;
        if (!roomId) return;
        socket.to(roomId).emit("languageUpdate", language);
    });

    socket.on("updateTerminal", (data: any) => {
        const { roomId } = socket.data;
        if (!roomId) return;
        socket.to(roomId).emit("updateTerminal", data);
    });
}
