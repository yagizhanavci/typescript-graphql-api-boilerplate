import { redis } from "../../redis";
import { v4 } from "uuid";
import { confirmUserPrefix } from "../constants/redisPrefixes";

export const createConfirmationUrl = (userId: number): string => {
  const token = v4();
  redis.set(confirmUserPrefix + token, userId, "ex", 60 * 60 * 24); // 1 day expiration time
  return `http://localhost:3000/confirm/${token}`;
};
