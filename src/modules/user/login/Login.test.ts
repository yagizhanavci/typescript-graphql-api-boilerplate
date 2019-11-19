import { testConn } from "../../../test-utils/testConn";
import { Connection } from "typeorm";
import { gCall } from "../../..//test-utils/gCall";
import faker from "faker";
import { User } from "../../../entity/User";

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

const loginMutation = `
mutation Login($email:String!,$password:String!){
  login(email:$email,password:$password){
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe("login resolver tests", () => {
  it("logs user successfully", async () => {
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(16),
      confirmed: true,
    };

    await User.create(user).save();

    const loginResponse = await gCall({
      source: loginMutation,
      variableValues: {
        email: user.email,
        password: user.password,
      },
    });

    expect(loginResponse).toEqual({
      data: {
        login: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        },
      },
    });
  });
});
