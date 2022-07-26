import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { MySQLPromisePool } from "@fastify/mysql";

declare module "fastify" {
  export interface FastifyInstance {
    mysql: MySQLPromisePool;
  }
}

const HousesRoute: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.get("/houses", {}, async (request, reply) => {
    try {
      const connection = await server.mysql.getConnection();
      const [rows, fields] = await connection.query(`SELECT * FROM house;`, []);
      connection.release();
      return reply.code(200).send(rows);
    } catch (error) {
      request.log.error(error);
      return reply.send(400);
    }
  });
};

export default fp(HousesRoute);
