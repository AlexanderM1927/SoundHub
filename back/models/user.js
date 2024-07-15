import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export class UserModel {
    constructor ({ connection }) {
        this.connection = connection
    }

    async login (input) {
        const user = await this.connection.query(
            `SELECT * FROM users WHERE user_email = ?;`,
            [input.user_email]
        )

        const validPassword = await bcrypt.compare(input.user_password, user[0][0].user_password);
        if (validPassword) {
            const token = jwt.sign({
                name: user.name,
                id: user._id
            }, process.env.TOKEN_SECRET)

            return {
                token,
                user
            }
        } else {
            throw new Error('Bad credentials') 
        }
    }

    async register (input) {
        // hash password
        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(input.user_password, salt)

        const user = {
            user_name: input.user_name,
            user_email: input.user_email,
            user_password: password,
            role_id: 1
        }

        try {
            await this.connection.query(
              `INSERT INTO users (user_name, user_email, user_password, role_id)
                VALUES (?, ?, ?, ?);`,
              [user.user_name, user.user_email, user.user_password, user.role_id]
            )

            return {
                user_name: user.user_name,
                user_email: user.user_email
            }
        } catch (e) {
            throw new Error('Error creating user')
        }
    }

    async setRank ({ user_id, role_id }) {

        try {
            await this.connection.query(
              `UPDATE users SET role_id = ? WHERE user_id = ?`,
              [user_id, role_id]
            )

            return {
                user_id: user_id,
                role_id, role_id
            }
        } catch (e) {
            throw new Error('Error giving rank')
        }
    }
}