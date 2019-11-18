import { createConnection } from "typeorm";

export const testConn = async (drop: boolean = false) => {
  return await createConnection({
    name: "default",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "typegraphql_typeorm_example_test",
    synchronize: drop,
    dropSchema: drop,
    entities: [__dirname + "/../entity/*.*"],
  });
};
