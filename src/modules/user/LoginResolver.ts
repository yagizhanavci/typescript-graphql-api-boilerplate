import {
  Resolver,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Query,
  Ctx,
  UseMiddleware,
  Int,
} from "type-graphql";
import { compare } from "bcryptjs";
import { User } from "../../entity/User";
import { MyContext } from "src/types/MyContext";
import { createAccessToken, createRefreshToken } from "./auth";
import { isAuth } from "../middlewares/isAuth";
import { getConnection } from "typeorm";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver(User)
export class LoginResolver {
  @Query(() => [User], { nullable: true })
  async getUsers(): Promise<User[] | null> {
    return await User.find();
  }

  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async bye(@Ctx() { payload }: MyContext) {
    return `your user id is ${payload!.userId}`;
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext,
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("User not found!");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("Invalid credentials!");
    }

    ctx.res.cookie("jid", createRefreshToken(user), { httpOnly: true });

    return {
      accessToken: createAccessToken(user),
    };
  }
}
