import app from "./app.js";
import initSocket from "./configs/socket.config.js";
import constants from "./constants.js";
import http from "http";
import namespaces from "./namespaces/index.js";

const server = http.createServer(app);
const io = initSocket(server);
namespaces(io);

server.listen(constants.PORT, () => {
    console.log(`Server is running on port ${constants.PORT}`);
});
