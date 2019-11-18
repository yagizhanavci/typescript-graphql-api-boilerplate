import { Resolver, Mutation, Arg } from "type-graphql";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import { hash } from "bcryptjs";

@Resolver(User)
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data") { token, password }: ChangePasswordInput,
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) return null;

    const user = await User.findOne(userId);

    if (!user) return null;

    user.password = await hash(password, 12);

    redis.del(forgotPasswordPrefix + token);
    await user.save();
    return user;
  }
}
