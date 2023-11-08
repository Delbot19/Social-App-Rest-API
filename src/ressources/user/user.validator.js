const z = require('zod').z;

const updateUser = z.object({
  body: z.object({
    username: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
  })
});

const getUser = z.object({
  params: z.object({
    id: z.string()
  })
});

const followUser = z.object({
  params: z.object({
    id: z.string()
  })
});

const unfollowUser = z.object({
  params: z.object({
    id: z.string()
  })
});

module.exports = { getUser, updateUser, followUser, unfollowUser }
