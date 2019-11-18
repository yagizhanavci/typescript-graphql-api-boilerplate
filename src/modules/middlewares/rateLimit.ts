import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../../types/MyContext";
import { redis } from "../../redis";

const ONE_DAY = 60 * 60 * 24;

export const rateLimit: (limit?: number) => MiddlewareFn<MyContext> = (
  limit = 50,
) => async ({ context: { req }, info }, next) => {
  const key = `rate-limit:${info.fieldName}:${req.ip}`; // rate-limit:register:127.0.0.1 e.g.
  const current = await redis.incr(key);

  if (current > limit) {
    throw new Error("Too many requests!");
  } else if (current === 1) {
    await redis.expire(key, ONE_DAY);
  }

  return next();
};
