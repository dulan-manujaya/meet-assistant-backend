import { fastify } from "fastify";
import pino from "pino";
import studentRoutes from "./routes/students.route";
import housesRoutes from "./routes/houses.route";
import dotenv from "dotenv";
dotenv.config();

const ConnectionString = process.env.CONNECTIONSTRING;
const server = fastify({
  logger: pino({ level: "info" }),
});

// Activate plugins below:
server.register(studentRoutes);
server.register(housesRoutes);
server.register(require("fastify-cors"), {
  origin: "*",
});

server.register(require("@fastify/mysql"), {
  promise: true,
  connectionString: ConnectionString,
});

const start = async () => {
  try {
    await server.listen({ port: 8000 });
    console.log("Server started successfully");
  } catch (err: any) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
