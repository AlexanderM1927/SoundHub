import jwt from 'jsonwebtoken'
// middleware to validate if is same user to update it
export const verifyUserUpdate = (req: any, res: any, next: any) => {
    const token = req.cookies
    if (!token) return res.status(401).json({ error: 'Acceso denegado' })
    try {
        const verified: any = jwt.verify(token.access_token, process.env.TOKEN_SECRET as string)
        const { user_id } = verified
        if (parseInt(user_id) === parseInt(req.params.id)) {
            next() // can
        } else {
            throw new Error("No puedes actualizar un perfil que no sea el tuyo");
        }
    } catch (error) {
        res.status(401).json({error: 'token no es válido'})
    }
}