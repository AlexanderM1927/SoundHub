import jwt from 'jsonwebtoken'
// middleware to validate token
export const verifyToken = (req: any, res: any, next: any) => {
    const token = req.cookies
    if (!token) return res.status(401).json({ error: 'Acceso denegado' })
    try {
        const verified = jwt.verify(token.access_token, process.env.TOKEN_SECRET as string)
        req.user = verified
        next() // can
    } catch (error) {
        res.status(401).json({error: 'token no es válido'})
    }
}