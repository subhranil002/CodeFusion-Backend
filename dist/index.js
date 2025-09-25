import app from "./app.js";
import constants from "./constants.js";
import http from "http";
import namespaces from "./namespaces/index.js";
import { connectCloudinary, connectDB, initSocket } from "./configs/index.js";
const server = http.createServer(app);
const io = initSocket(server);
namespaces(io);
connectDB().then(() => {
    connectCloudinary().finally(() => {
        server.listen(constants.PORT || 3500, async () => {
            console.log(`Server running on port ${constants.PORT}`);
        });
    });
});
