import { graphql, GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import Maybe from "graphql/tsutils/Maybe";

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  userId?: number;
}
let schema: GraphQLSchema;
export const gCall = async ({ source, variableValues, userId }: Options) => {
  if (!schema) {
    schema = await buildSchema({
      resolvers: [__dirname + "/../modules/*/*.ts"],
      authChecker: ({ context: { req } }) => {
        if (req.session.userId) return true;
        return false;
      },
    });
  }
  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {
        session: {
          userId,
        },
      },
      res: {
        clearCookie: jest.fn(),
      },
    },
  });
};
