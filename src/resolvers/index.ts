import { Resolvers } from "../generated/graphql";

const resolvers: Resolvers = {
  Query: {
    greetings: async (_parent, _args, context) => {
      const session = context.driver.session();

      try {
        const result = await session.readTransaction((tx) =>
          tx.run("MATCH (g:Greeting) RETURN g")
        );

        const greetings = result.records.map(
          (record) => record.get(0).properties
        );

        return greetings;
      } catch (error) {
        throw error;
      } finally {
        await session.close();
      }
    },
  },
  Mutation: {
    hello: async (_parent, args, context) => {
      const session = context.driver.session();

      try {
        const result = await session.writeTransaction((tx) =>
          tx.run("CREATE (g:Greeting { message: $message }) RETURN g", args)
        );

        const singleRecord = result.records[0];
        const node = singleRecord.get(0);

        return node.properties;
      } catch (error) {
        throw error;
      } finally {
        await session.close();
      }
    },
  },
};

export default resolvers;
