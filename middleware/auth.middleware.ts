import { Request, Response, NextFunction } from 'express';
import jwt from 'jwt-simple';
import moment from 'moment';
import { clave_secreta } from '../environment/environment';

export interface CustomRequest extends Request {
    user?: any;
}

export const verificarToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Asegúrate de extraer solo el token

    if (!token) {
        return res.status(403).json({ mensaje: 'No se proporcionó un token' });
    }

    try {
        const payload = jwt.decode(token, clave_secreta);

        if (payload.exp <= moment().unix()) {
            return res.status(401).json({ mensaje: 'El token ha expirado' });
        }

        req.user = payload;
        next();
    } catch (error) {
        return res.status(403).json({ mensaje: 'Token inválido' });
    }
};
