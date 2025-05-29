import z from 'zod'

const userSchema = z.object({
  username: z.string().min(3).max(20, {
    message: 'Username must be between 3 and 20 characters long'
  }).regex(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores'
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long'
  }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  }),
  email: z.string().email({
    message: 'Email must be a valid email address'
  }),
})

export function validateUser (input: unknown) {
  return userSchema.safeParse(input)
}

export function validatePartialUser (input: unknown) {
  return userSchema.partial().safeParse(input)
}