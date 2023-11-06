const z = require("zod").z;

const createUser = z.object({
  body: z.object({
    username: z.string(),
    email: z.string(),
    password: z
      .string()
      .min(8, "Password should have at least 8 characters.")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*()_+]/,
        "Password should have alphanumeric characters."
      ),
  }),
});

const login = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
});

module.exports = { createUser, login };
