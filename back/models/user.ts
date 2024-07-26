import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export class UserModel {
    connection: any
    constructor ({ connection }:{ connection: any }) {
        this.connection = connection
    }

    async login (input: any) {
        const query = await this.connection.query(
            `SELECT * FROM users WHERE user_email = ?;`,
            [input.user_email]
        )
        const user = query[0][0]

        const validPassword = await bcrypt.compare(input.user_password, user.user_password);
        if (validPassword) {
            const token = jwt.sign({
                "user_name": user.user_name,
                "user_id": user.user_id
            }, (process.env as any).TOKEN_SECRET)

            return {
                token,
                user: user
            }
        } else {
            throw new Error('Bad credentials') 
        }
    }

    async create (input: any) {
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

    async setRank ({ user_id, role_id }: { user_id: Number, role_id: Number }) {

        try {
            await this.connection.query(
              `UPDATE users SET role_id = ? WHERE user_id = ?`,
              [user_id, role_id]
            )

            return {
                user_id: user_id,
                role_id: role_id
            }
        } catch (e) {
            throw new Error('Error giving rank')
        }
    }

    async getUserById ({ user_id }: { user_id: Number }) {

        try {
            const query = await this.connection.query(
              `SELECT * FROM users WHERE user_id = ?`,
              [user_id]
            )
            const user = {
                user_name: query[0][0].user_name,
                user_id: query[0][0].user_id,
                user_email: query[0][0].user_email,
                user_country: query[0][0].user_country,
            }

            return {
                user: user
            }
        } catch (e) {
            throw new Error('Error getting user')
        }
    }

    async getUserByUserName ({ user_name }: { user_name: string }) {

        try {
            const query = await this.connection.query(
              `SELECT * FROM users WHERE user_name LIKE ?`,
              [`%${user_name}%`]
            )

            return query[0].map((usr: any) => {
                return {
                    user_name: usr.user_name,
                    user_id: usr.user_id,
                    user_email: usr.user_email,
                    user_country: usr.user_country,
                }
            })
        } catch (e) {
            throw new Error('Error getting user')
        }
    }

    async update ({ user_id, user_email, user_country, user_name }:
        { user_id: Number, user_email: String, user_country: String, user_name: String }
    ) {
        try {
            await this.connection.query(
              `UPDATE users 
              SET user_email = ?, user_country = ?, user_name = ? 
              WHERE user_id = ?;`,
              [user_email, user_country, user_name, user_id]
            )

            const { user } = await this.getUserById({ user_id })

            return {
                user: user
            }
        } catch (e) {
            throw new Error('Error updating user')
        }
    }
}