import { io, Socket } from "socket.io-client";
const socketUrl = 'https://trocco-app-be.onrender.com';


let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io({
      path: socketUrl, // must match the server path
    });

    socket.on("connect", () => {
      console.log("Socket IO connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket IO disconnected");
    });
  }

  return socket;
};

export const joinRoom = (roomId: string) =>{
    socket?.emit("join_room", roomId);
}

export const listen = <T>(roomId: string, onData: (data: T)=> void) =>{
    socket?.on(roomId, onData);
}