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

const meQuery = `
{
  me{
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe("me resolver", () => {
  it("gets logged in user", async () => {
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(10),
    };

    const dbUser = await User.create(user).save();

    const response = await gCall({
      source: meQuery,
      userId: dbUser.id,
    });

    expect(response).toMatchObject({
      data: {
        me: {
          id: `${dbUser.id}`,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          email: dbUser.email,
        },
      },
    });
  });

  it("gets null if no logged user found", async () => {
    const response = await gCall({
      source: meQuery,
    });

    expect(response).toMatchObject({
      data: {
        me: null,
      },
    });
  });
});
