import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
// @ts-ignore
import { user as User } from '../models'
import { Op } from 'sequelize';

export class UserRepository {
    
    constructor () {
        
    }

    async login (input: any) {
        const user = await User.findOne({ 
            where: {
              user_email: input.user_email
            }
        })

        const validPassword = await bcrypt.compare(input.user_password, user.dataValues.user_password);

        if (validPassword) {
            const token = jwt.sign({
                name: user.dataValues.name,
                user_id: user.dataValues.user_id
            }, (process.env as any).TOKEN_SECRET)


            return {
                token,
                user: user.dataValues
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
            const userSaved = new User(user).save()

            return userSaved
        } catch (e) {
            throw new Error('Error creating user')
        }
    }

    async setRank ({ user_id, role_id }: { user_id: Number, role_id: Number }) {

        try {
            const user = await User.findOne({ user_id })
            user.role_id = role_id
            const userSaved = user.save()

            return userSaved
        } catch (e) {
            throw new Error('Error giving rank')
        }
    }

    async getUserById ({ user_id }: { user_id: Number }) {

        try {
            const user = await User.findOne({ 
                where: {
                  user_id
                }
            })

            return {
                user: user.dataValues
            }
        } catch (e) {
            throw new Error('Error getting user')
        }
    }

    async getUserByUserName ({ user_name }: { user_name: string }) {

        try {
            const users = await User.findAll({ 
                where: {
                    user_name: {
                        [Op.like]: '%' + user_name + '%'
                    }
                }
            })

            return users
        } catch (e) {
            throw new Error('Error getting user')
        }
    }

    async update ({ user_id, user_email, user_country, user_name }:
        { user_id: Number, user_email: String, user_country: String, user_name: String }
    ) {
        try {
            const user = await User.findOne({ user_id })
            user.user_email = user_email
            user.user_country = user_country
            user.user_name = user_name
            const userSaved = user.save()

            return userSaved
        } catch (e) {
            throw new Error('Error updating user')
        }
    }
}