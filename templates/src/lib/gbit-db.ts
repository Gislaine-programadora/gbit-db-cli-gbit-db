import "server-only";
import * as gbit from "gbit-db-dados";

const DB_PATH = "./gbit-db-dados";

export const db = gbit.open(DB_PATH);

export const users = db.collection("users", {
  name: {
    type: "string",
    required: true,
    minLength: 2,
  },

  email: {
    type: "string",
    required: true,
    unique: true,
    format: "email",
  },

  password: {
    type: "string",
    required: true,
    minLength: 6,
  },

  role: {
    type: "string",
    required: true,
    enum: ["ADMIN", "CLIENT"],
  },
});