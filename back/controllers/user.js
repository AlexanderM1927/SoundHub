import { validateUser, validatePartialUser } from '../schemas/user.js'

export class UserController {
    constructor (userModel) {
        this.userModel = userModel
    }

    login = async (req, res) => {
        const result = validatePartialUser(req.body)

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        try {
            const { token, user } = await this.userModel.login(req.body)

            return res.header('auth-token', token).json({
                error: null,
                data: {
                    token: token,
                    user: user
                }
            })
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }


    register = async (req, res) => {
        const result = validateUser(req.body)

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
    
        try {
            const savedUser = await this.userModel.register(req.body)
            res.json({
                error: null,
                data: savedUser
            })
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }

    setRank = async (req, res) => {
        const {
            user_id,
            role_id
        } = req.body
    
        try {
            const savedUser = await this.userModel.setRank({user_id, role_id})
            res.json({
                error: null,
                data: savedUser
            })
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }
}