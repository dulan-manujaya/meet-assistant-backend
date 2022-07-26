import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { MySQLPromisePool } from "@fastify/mysql";

declare module "fastify" {
  export interface FastifyInstance {
    mysql: MySQLPromisePool;
  }
}

interface StudentsParams {
  id: number;
}

const StudentsRoute: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.get("/students", {}, async (request, reply) => {
    try {
      const connection = await server.mysql.getConnection();
      const [rows, fields] = await connection.query(
        `SELECT S.*, H.house_name, AG.age_group_name FROM students S
        INNER JOIN house H
        ON H.house_id = S.house_id
        INNER JOIN age_group AG
        ON AG.age_group_id = S.age_group_id;`,
        []
      );
      connection.release();
      return reply.code(200).send(rows);
    } catch (error) {
      request.log.error(error);
      return reply.send(400);
    }
  });

  server.get<{ Params: StudentsParams }>(
    "/students/:id",
    {},
    async (request, reply) => {
      try {
        const connection = await server.mysql.getConnection();
        const [students, fields] = await connection.query(
          `SELECT S.*, H.house_name, AG.age_group_name FROM students S
          INNER JOIN house H
          ON H.house_id = S.house_id
          INNER JOIN age_group AG
          ON AG.age_group_id = S.age_group_id
          WHERE S.student_id = ?;`,
          [request.params.id]
        );
        let student: any = students;
        connection.release();
        return reply.code(200).send(student[0]);
      } catch (error) {
        request.log.error(error);
        return reply.send(400);
      }
    }
  );

  server.post<{ Params: StudentsParams }>(
    "/students",
    {},
    async (request, reply) => {
      try {
        const connection = await server.mysql.getConnection();
        let body: any = request.body;

        const [rows, fields] = await connection.query(
          "INSERT INTO students (f_name, l_name, grade, dob, house_id, age_group_id, gender) VALUES (?,?,?,?,?,?,?)",
          [
            body.f_name,
            body.l_name,
            body.grade,
            body.dob,
            body.house,
            body.age_group,
            body.gender,
          ]
        );
        connection.release();
        return reply.code(200).send(rows);
      } catch (error) {
        request.log.error(error);
        return reply.send(400);
      }
    }
  );

  server.patch<{ Params: StudentsParams }>(
    "/students/:id",
    {},
    async (request, reply) => {
      try {
        const connection = await server.mysql.getConnection();
        let body: any = request.body;

        const [rows, fields] = await connection.query(
          `UPDATE students
          SET 
          f_name = ?, 
          l_name = ?,
          grade = ?,
          dob = ?,
          house = ?,
          age_group = ?,
          gender = ?,
          WHERE student_id = ?;`,
          [
            body.f_name,
            body.l_name,
            body.grade,
            body.dob,
            body.house,
            body.age_group,
            body.gender,
            request.params.id,
          ]
        );
        connection.release();
        return reply.code(200).send(rows);
      } catch (error) {
        request.log.error(error);
        return reply.send(400);
      }
    }
  );

  server.delete<{ Params: StudentsParams }>(
    "/students/:id",
    {},
    async (request, reply) => {
      try {
        const connection = await server.mysql.getConnection();

        const [rows, fields] = await connection.query(
          "DELETE FROM students WHERE student_id = ?;",
          [request.params.id]
        );
        connection.release();
        return reply.code(200).send(rows);
      } catch (error) {
        request.log.error(error);
        return reply.send(400);
      }
    }
  );
};

export default fp(StudentsRoute);
