import { Query, Ctx, Resolver } from "type-graphql";
import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    if (req.session && req.session.userId) {
      const user = await User.findOne(req.session.userId);
      return user;
    } else {
      return undefined;
    }
  }
}
