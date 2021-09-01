import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import neo4j from "neo4j-driver";
import root from "./resolvers";
import typeDefs from "./type-defs";

const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "neo4j",
    process.env.NEO4J_PASSWORD || "letmein"
  )
);

const isDev = process.env.NODE_ENV === "development";

const host = process.env.GRAPHQL_SERVER_HOST || "localhost";
const path = process.env.GRAPHQL_SERVER_PATH || "/graphql";
const port = process.env.GRAPHQL_SERVER_PORT || 4000;

const schema = buildSchema(typeDefs);

const app = express();

const server = async () => {
  app.use(
    path,
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: isDev,
      context: {
        driver,
      },
    })
  );

  app.listen({ host, path, port }, () => {
    console.log(
      `Running a GraphQL API server at http://${host}:${port}${path}`
    );
  });
};

server();
