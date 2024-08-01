import 'dotenv/config'
import { validatePartialUser } from '../schemas/user'

export class UserController {
    userRepository: any
    constructor (userRepository: any) {
        this.userRepository = userRepository
    }

    login = async (req: any, res: any) => {
        const result = validatePartialUser(req.body)

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        try {
            const { token, user } = await this.userRepository.login(req.body)

            const options = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                // sameSite: 'none',
                // "expires" - The cookie expires in 24 hours
                maxAge: 1000 * 60 * 60 * 24, // 24 hours,
                origin: process.env.FRONT_URL
            }

            console.log('optiones', options)

            res.cookie('access_token', token, options)
            res.json({
                error: null,
                data: {
                    user
                }
            })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }


    register = async (req: any, res: any) => {
        const result = validatePartialUser(req.body)

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
    
        try {
            const savedUser = await this.userRepository.create(result.data)
            res.json({
                error: null,
                data: savedUser
            })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }

    setRank = async (req: any, res: any) => {
        const {
            user_id,
            role_id
        } = req.body
    
        try {
            const savedUser = await this.userRepository.setRank({user_id, role_id})
            res.json({
                error: null,
                data: savedUser
            })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }

    getUserById = async (req: any, res: any) => {
        const {
            id
        } = req.params

        try {
            const { user } = await this.userRepository.getUserById({ user_id: id })
            res.json({
                error: null,
                data: user
            })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }

    update = async (req: any, res: any) => {
        const {
            id
        } = req.params

        const result = validatePartialUser(req.body)

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }


        try {
            const { user } = await this.userRepository.update({ 
                user_id: id, 
                user_email: result.data.user_email,
                user_name: result.data.user_name, 
                user_country: result.data.user_country 
            })
            res.json({
                error: null,
                data: user
            })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }

    logout = async (_req: any, res: any) => {
        try {
            res.clearCookie('access_token')
            res.json({ message: "Logout success" })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }
}