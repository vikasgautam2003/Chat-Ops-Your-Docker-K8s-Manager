"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const dotenv_1 = __importDefault(require("dotenv"));
const toolRoutes_1 = __importDefault(require("./routes/toolRoutes"));
const websocket_1 = require("./lib/websocket");
require("./lib/dockerWorker");
require("./lib/codeWorker");
require("./lib/k8sWorker");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.json());
const server = (0, http_1.createServer)(app);
(0, websocket_1.initWebSocket)(server);
app.use("/tools", toolRoutes_1.default);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Distributed System Online on port ${PORT}`);
    console.log(`   - Worker 1: Docker Ops (Active)`);
    console.log(`   - Worker 2: Code Gen (Active)`);
});
