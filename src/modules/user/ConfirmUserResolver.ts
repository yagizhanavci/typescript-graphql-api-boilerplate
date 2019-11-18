import { Resolver, Mutation, Arg } from "type-graphql";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { confirmUserPrefix } from "../constants/redisPrefixes";

@Resolver(User)
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<Boolean | null> {
    const userId = await redis.get(confirmUserPrefix + token);

    if (!userId) {
      return false;
    }

    if (userId) {
      await User.update({ id: parseInt(userId, 10) }, { confirmed: true });
      await redis.del(token);
      return true;
    }
    return null;
  }
}
