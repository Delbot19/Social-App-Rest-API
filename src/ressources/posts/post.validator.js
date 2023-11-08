const z = require('zod').z;

const createPost = z.object({
  body: z.object({
    desc: z.string(),
    img: z.string().optional(),
    likes: z.array().optional(),
  })
})

const updatePost = z.object({
  body: z.object({
    desc: z.string().optional(),
    img: z.string().optional(),
  }),
  params: z.object({
    id: z.string()
  })
})

const deletePost = z.object({
  params: z.object({
    id: z.string()
  })
})

const likePost = z.object({
  params: z.object({
    id: z.string()
  })
})

const getPost = z.object({
  params: z.object({
    id: z.string()
  })
})



module.exports = { createPost, updatePost, deletePost, likePost, getPost }
