import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../../types/MyContext";
import { verify } from "jsonwebtoken";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authHeader = context.req.headers["authorization"]; // Must be "bearer ${token}"
  if (!authHeader) throw new Error("not authenticated");
  try {
    const token = authHeader.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
    throw new Error("not authenticated");
  }
  return next();
};
