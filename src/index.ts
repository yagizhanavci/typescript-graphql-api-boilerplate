import "dotenv/config";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cors from "cors";
import { MyContext } from "./types/MyContext";
import { LoginResolver } from "./modules/user/LoginResolver";
import { MeResolver } from "./modules/user/Me";
import { LogoutResolver } from "./modules/user/LogoutResolver";
import { ProfilePictureResolver } from "./modules/user/ProfilePictureResolver";
import { RegisterResolver } from "./modules/user/RegisterResolver";
import { ProductResolver } from "./modules/product/ProductResolver";
import { CategoryResolver } from "./modules/category/CategoryResolver";

const main = async () => {
  const schema = await buildSchema({
    resolvers: [
      MeResolver,
      LogoutResolver,
      ProfilePictureResolver,
      RegisterResolver,
      LoginResolver,
      ProductResolver,
      CategoryResolver,
    ],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: MyContext) => ({ req, res }),
  });

  const app = Express();

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000", // Front end host
    }),
  );

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(process.env.PORT || 4000, async () => {
    await createConnection("default");
    console.log("Server started on http://localhost:4000/graphql");
  });
};

main();
