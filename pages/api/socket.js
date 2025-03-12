import { Server } from "socket.io";
import { Client } from "pg";

const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
});

pgClient.connect();

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket",
    });

    pgClient.query("LISTEN users_update");

    pgClient.on("notification", (msg) => {
      try {
        io.emit("users_update", JSON.parse(msg.payload));
      } catch (error) {
        console.log("Error en el proceso de notificación: ", error);
      }
    });
    res.socket.server.io = io;
  }
  res.end();
}