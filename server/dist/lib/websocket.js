"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastLog = exports.initWebSocket = void 0;
const ws_1 = __importStar(require("ws"));
let wss = null;
const initWebSocket = (server) => {
    wss = new ws_1.WebSocketServer({ server });
    wss.on("connection", (ws) => {
        ws.send("\r\n\x1b[32m✔ Connected to Distributed Command Center.\x1b[0m\r\n");
    });
};
exports.initWebSocket = initWebSocket;
const broadcastLog = (msg) => {
    console.log(`[LOG] ${msg}`);
    if (!wss)
        return;
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `\r\n\x1b[36m[${timestamp}]\x1b[0m ${msg}`;
    wss.clients.forEach((client) => {
        if (client.readyState === ws_1.default.OPEN) {
            client.send(logMessage);
        }
    });
};
exports.broadcastLog = broadcastLog;
