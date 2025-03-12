// server.js
const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const { Client } = require("pg");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  // Conexión de PostgreSQL
  const pgClient = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  pgClient.connect();
  pgClient.query("LISTEN users_update");

  // Configuración de Socket.IO
  const io = new Server(server, {
    path: "/socket",
  });

  pgClient.on("notification", (msg) => {
    io.emit("users_update", JSON.parse(msg.payload));
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
