const z = require("zod").z;

const createUser = z.object({
  body: z.object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
  }),
});

const login = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
});

module.exports = { createUser, login };
