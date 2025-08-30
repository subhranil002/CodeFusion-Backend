import { Namespace } from "socket.io";
import CustomSocket from "../types/socket.js";

type User = {
    id: string;
    name: string;
    isTyping: boolean;
    avatar?: string;
    socketId?: string;
};

const rooms = new Map<string, Map<string, User>>();

export default function editorSockets(
    socket: CustomSocket,
    editorNamespace: Namespace
) {
    socket.data.roomId = null as string | null;
    socket.data.userId = null as string | null;
    socket.data.userName = null as string | null;
    socket.data.typing = false as boolean;

    function leaveRoom() {
        const { roomId, userId, userName } = socket.data as {
            roomId: string | null;
            userId: string | null;
            userName: string | null;
        };
        if (!roomId || !userId) return;

        socket.leave(roomId);

        const state = rooms.get(roomId);
        if (!state) return;

        state.delete(userId);

        if (state.size === 0) {
            rooms.delete(roomId);
        } else {
            socket.to(roomId).emit("userLeft", {
                userName,
                users: Array.from(state.values()),
            });
        }

        socket.data.roomId = null;
        socket.data.userId = null;
        socket.data.userName = null;
        socket.data.typing = false;
    }

    socket.once("disconnect", leaveRoom);
    socket.on("leaveRoom", leaveRoom);

    socket.on(
        "verifyUniqueUser",
        ({ roomId, userId }: { roomId: string; userId: string }) => {
            const state = rooms.get(roomId);
            const unique = !state?.has(userId);
            editorNamespace.to(socket.id).emit("uniqueUser", unique);
        }
    );

    socket.on(
        "join",
        ({
            roomId,
            userId,
            userName,
            avatar,
        }: {
            roomId: string;
            userId: string;
            userName: string;
            avatar?: string;
        }) => {
            leaveRoom();

            socket.join(roomId);
            socket.data.roomId = roomId;
            socket.data.userId = userId;
            socket.data.userName = userName;
            socket.data.typing = false;

            const state = rooms.get(roomId) ?? new Map<string, User>();

            state.set(userId, {
                id: userId,
                name: userName,
                isTyping: false,
                avatar,
                socketId: socket.id,
            });

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
        const { roomId, userId } = socket.data as {
            roomId: string | null;
            userId: string | null;
        };
        if (!roomId || !userId) return;

        socket.data.typing = true;
        const state = rooms.get(roomId);
        if (!state) return;

        const user = state.get(userId);
        if (!user) return;

        user.isTyping = true;

        editorNamespace.to(roomId).emit("updateUsers", {
            users: Array.from(state.values()),
        });
    });

    socket.on("stopTyping", () => {
        const { roomId, userId } = socket.data as {
            roomId: string | null;
            userId: string | null;
        };
        if (!roomId || !userId) return;

        socket.data.typing = false;
        const state = rooms.get(roomId);
        if (!state) return;

        const user = state.get(userId);
        if (!user) return;

        user.isTyping = false;

        editorNamespace.to(roomId).emit("updateUsers", {
            users: Array.from(state.values()),
        });
    });

    socket.on("codeChange", ({ code }: { code: string }) => {
        const { roomId } = socket.data as { roomId: string | null };
        if (!roomId) return;
        socket.to(roomId).emit("codeUpdate", code);
    });

    socket.on("updateTerminal", (data: any) => {
        const { roomId } = socket.data as { roomId: string | null };
        if (!roomId) return;
        socket.to(roomId).emit("updateTerminal", data);
    });

    socket.on("kickCall", (userId: { userId: string }) => {
        const { roomId } = socket.data as { roomId: string | null };
        if (!roomId) return;
        socket.to(roomId).emit("kickCall", userId);
    });

    socket.on("kickAction", (userId: { userId: string }) => {
        if (socket.data.userId === userId) {
            leaveRoom();
            editorNamespace.to(socket.id).emit("IAMKICKED");
        }
    });
}
