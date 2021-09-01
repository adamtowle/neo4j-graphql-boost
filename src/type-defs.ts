import fs from "fs";
import path from "path";

export default fs
  .readFileSync(path.join(__dirname, "schema.graphql"))
  .toString("utf-8");
