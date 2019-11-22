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
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken, createRefreshToken } from "./modules/user/auth";

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
  app.use(cookieParser());

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000", // Front end host
    }),
  );

  app.get("/refresh_token", async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }
    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: "" });
    }

    const user = await User.findOne({ id: payload.userId });

    if (!user) return res.send({ ok: false, accessToken: "" });

    if (user.tokenVersion !== payload.tokenVersion)
      return res.send({ ok: false, accessToken: "" });

    res.cookie("jid", createRefreshToken(user), { httpOnly: true });

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(process.env.PORT || 4000, async () => {
    await createConnection("default");
    console.log("Server started on http://localhost:4000/graphql");
  });
};

main();
