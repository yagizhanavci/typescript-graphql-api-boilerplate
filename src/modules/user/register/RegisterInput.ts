import { InputType, Field } from "type-graphql";
import { Length, IsEmail } from "class-validator";
import { IsEmailAlreadyExist } from "./IsEmailAlreadyExist";

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255, { message: "first name field length validation error" })
  firstName: string;

  @Field()
  @Length(1, 255, { message: "last name field length validation error" })
  lastName: string;

  @Field()
  @IsEmail(undefined, { message: "email field validation error" })
  @IsEmailAlreadyExist({ message: "email already in use" })
  email: string;

  @Field()
  password: string;
}
