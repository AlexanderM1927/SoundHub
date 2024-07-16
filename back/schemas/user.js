import z from 'zod'

const userSchema = z.object({
    user_name: z.string().min(6).max(255),
    user_country: z.string().min(4).max(255),
    user_email: z.string().min(6).max(255).email(),
    user_password: z.string().min(6).max(255),
    user_passwordConfirm: z.string().min(6).max(255)
})

export function validateUser (input) {
    return userSchema.safeParse(input)
}

export function validatePartialUser (input) {
    return userSchema.partial().safeParse(input)
}