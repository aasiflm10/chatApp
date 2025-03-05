"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let userCount = 0;
let allSockets = [];
wss.on("connection", (socket) => {
    userCount = userCount + 1;
    console.log("user connected #" + userCount);
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        console.log(message.toString());
        console.log(parsedMessage);
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.message,
            });
        }
        if (parsedMessage.type === "chat") {
            // const currentUserRoom = allSockets.find((x)=> x.socket == socket)?.room;
            let currentUserRoom = null;
            for (let i = 0; i < allSockets.length; ++i) {
                if (allSockets[i].socket == socket) {
                    currentUserRoom = allSockets[i].room;
                }
            }
            //send the message to all users who are in that room
            for (let i = 0; i < allSockets.length; ++i) {
                if (allSockets[i].room == currentUserRoom) {
                    allSockets[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
});
