import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from "cors";
import { MyContext } from "./types/MyContext";
import { Redis } from "ioredis";

const main = async () => {
  const schema = await buildSchema({
    resolvers: [__dirname + "/modules/*/*.ts"],
    authChecker: ({ context: { req } }) => {
      if (req.session.userId) return true;
      return false;
    },
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: MyContext) => ({ req, res }),
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000", // Front end host
    }),
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as Redis,
      }),
      secret: "jhehuahuhheuehue",
      name: "qid",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    }),
  );

  apolloServer.applyMiddleware({ app });

  app.listen(process.env.PORT || 4000, async () => {
    await createConnection("default");
    console.log("Server started on http://localhost:4000/graphql");
  });
};

main();
