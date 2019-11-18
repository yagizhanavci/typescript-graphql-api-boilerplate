import {
  Resolver,
  Query,
  Mutation,
  Arg,
  FieldResolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { hash } from "bcryptjs";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { isAuth } from "../middlewares/isAuth";
import { sendEmail } from "../utils/sendEmail";
import { createConfirmationUrl } from "../utils/createConfirmationUrl";
import { rateLimit } from "../middlewares/rateLimit";

@Resolver(User)
export class RegisterResolver {
  @UseMiddleware(isAuth)
  @Query(() => String)
  async hello() {
    return "Hello World!";
  }

  @FieldResolver()
  async name(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Mutation(() => User)
  @UseMiddleware(rateLimit())
  async register(
    @Arg("data") { firstName, lastName, email, password }: RegisterInput,
  ): Promise<User> {
    const hashedPassword = await hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    await sendEmail(email, createConfirmationUrl(user.id));

    return user;
  }
}
