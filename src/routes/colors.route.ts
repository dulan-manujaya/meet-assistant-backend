import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import * as colorFunctions from "../services/colors.service";

// Declaration merging
declare module "fastify" {
  export interface FastifyInstance {}
}

interface ColorsParams {
  count: number;
}

const ColorsRoute: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.get<{ Params: ColorsParams }>(
    "/colors/:count",
    {},
    async (request, reply) => {
      try {
        const Count = request.params.count;
        var response = [];

        const functionsArray = [
          colorFunctions.rgbColor,
          colorFunctions.hslColor,
        ];

        for (let i = 0; i < Count; i++) {
          const randomNumber = Math.floor(
            Math.random() * functionsArray.length
          );
          const randomFunction = functionsArray[randomNumber];
          const randomColor = await randomFunction();
          response.push(randomColor);
        }

        return reply.code(200).send(response);
      } catch (error) {
        request.log.error(error);
        return reply.send(400);
      }
    }
  );
};

export default fp(ColorsRoute);
