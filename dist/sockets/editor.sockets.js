const rooms = new Map();
export default function editorSockets(socket, editorNamespace) {
    socket.data.roomId = null;
    socket.data.userId = null;
    socket.data.userName = null;
    socket.data.typing = false;
    function leaveRoom() {
        const { roomId, userId, userName } = socket.data;
        if (!roomId || !userId)
            return;
        socket.leave(roomId);
        const state = rooms.get(roomId);
        if (!state)
            return;
        state.delete(userId);
        if (state.size === 0) {
            rooms.delete(roomId);
        }
        else {
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
    socket.on("verifyUniqueUser", ({ roomId, userId }) => {
        const state = rooms.get(roomId);
        const unique = !state?.has(userId);
        editorNamespace.to(socket.id).emit("uniqueUser", unique);
    });
    socket.on("join", ({ roomId, userId, userName, avatar, }) => {
        leaveRoom();
        socket.join(roomId);
        socket.data.roomId = roomId;
        socket.data.userId = userId;
        socket.data.userName = userName;
        socket.data.typing = false;
        const state = rooms.get(roomId) ?? new Map();
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
    });
    socket.on("startTyping", () => {
        const { roomId, userId } = socket.data;
        if (!roomId || !userId)
            return;
        socket.data.typing = true;
        const state = rooms.get(roomId);
        if (!state)
            return;
        const user = state.get(userId);
        if (!user)
            return;
        user.isTyping = true;
        editorNamespace.to(roomId).emit("updateUsers", {
            users: Array.from(state.values()),
        });
    });
    socket.on("stopTyping", () => {
        const { roomId, userId } = socket.data;
        if (!roomId || !userId)
            return;
        socket.data.typing = false;
        const state = rooms.get(roomId);
        if (!state)
            return;
        const user = state.get(userId);
        if (!user)
            return;
        user.isTyping = false;
        editorNamespace.to(roomId).emit("updateUsers", {
            users: Array.from(state.values()),
        });
    });
    socket.on("codeChange", ({ code }) => {
        const { roomId } = socket.data;
        if (!roomId)
            return;
        socket.to(roomId).emit("codeUpdate", code);
    });
    socket.on("updateTerminal", (data) => {
        const { roomId } = socket.data;
        if (!roomId)
            return;
        socket.to(roomId).emit("updateTerminal", data);
    });
    socket.on("roomUpdateTrigger", (data) => {
        const { roomId } = socket.data;
        if (!roomId)
            return;
        socket.to(roomId).emit("roomUpdateTrigger");
    });
    socket.on("kickCall", (userId) => {
        const { roomId } = socket.data;
        if (!roomId)
            return;
        socket.to(roomId).emit("kickCall", userId);
    });
    socket.on("kickAction", (userId) => {
        if (socket.data.userId === userId) {
            leaveRoom();
            editorNamespace.to(socket.id).emit("IAMKICKED");
        }
    });
}
