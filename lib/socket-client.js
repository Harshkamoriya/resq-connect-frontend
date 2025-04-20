// lib/socket-client.js
import { io } from "socket.io-client"
const port  = process.env.NEXT_PUBLIC_SOCKET_URL

const socket = io(port, {
  autoConnect: true,
  transports: ["websocket"],
})

export default socket
