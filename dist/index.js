"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const watch_1 = require("./watch");
dotenv_1.default.config();
const bootstrap = () => __awaiter(void 0, void 0, void 0, function* () {
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '8080';
    const serverUrl = `http://${host}:${port}`;
    const syncSource = 'test-repo';
    const socket = socket_io_client_1.default(serverUrl, {
        transports: ['websocket']
    });
    socket.on("patch" /* PATCH */, (patch) => {
        watch_1.patchApply(patch).then(() => console.log('patched'));
    });
    socket.on("connect" /* CLIENT_CONNECT */, () => {
        console.log('connected');
        watch_1.patchWatch(syncSource).on('patched', patch => {
            console.log('sending patch');
            socket.emit("patch" /* PATCH */, patch);
        });
    });
    socket.on("list_users" /* LIST_USERS */, (users) => {
        console.log(users);
    });
    socket.on("message" /* MESSAGE */, (msg) => {
        console.log(msg);
    });
});
bootstrap();
//# sourceMappingURL=index.js.map