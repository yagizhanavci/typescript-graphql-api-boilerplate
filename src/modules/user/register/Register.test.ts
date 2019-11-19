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

const registerMutation = `
  mutation Register($data:RegisterInput!){
    register(
      data:$data
    ){
      id
      firstName
      lastName
      email
      name
    }
  }
`;

describe("register resolver", () => {
  it("create user", async () => {
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(10),
    };
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        data: user,
      },
    });

    expect(response).toMatchObject({
      data: {
        register: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        },
      },
    });

    // Check for user
    let dbuser = await User.findOne({ where: { email: user.email } });

    expect(dbuser).toBeDefined();
    expect(dbuser!.confirmed).toBeFalsy();

    // Confirm User
    await User.update({ id: dbuser!.id }, { confirmed: true });

    dbuser = await User.findOne({ where: { email: user.email } });

    expect(dbuser!.confirmed).toBeTruthy();
  });
});
