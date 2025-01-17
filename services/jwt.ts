/**
 * Módulo para la gestión de tokens JWT (JSON Web Tokens).
 */
import jwt from 'jwt-simple';
import moment from 'moment';

import { clave_secreta } from '../environment/environment';

/**
 * Clase para la creación y gestión de tokens JWT.
 */
class JWT {

    /**
     * Clave secreta utilizada para firmar los tokens JWT.
     */
    public clave_jwt = clave_secreta;

    /**
     * Crea un nuevo token JWT con la información proporcionada del usuario.
     * @param usuario Objeto que contiene la información del usuario para incluir en el token.
     * @returns El token JWT generado.
     */
    public CrearToken(usuario: { id: number, nombre: string, usuario: string, pass: string, correo: string, id_pais: number, estado: number }): string {

        // Creación del payload del token con la información del usuario y fechas de creación y expiración
        let payload = {
            id: usuario.id,
            usuario: usuario.usuario,
            nombre: usuario.nombre,
            correo: usuario.correo,
            id_pais: usuario.id_pais,
            estado: usuario.estado,
            iat: moment().unix(), // Fecha de emisión del token (en formato Unix)
            exp: moment().add(30, 'days').unix() // Fecha de expiración del token (30 días desde la emisión)
        };

        // Codificación del payload para generar el token JWT utilizando la clave secreta
        return jwt.encode(payload, this.clave_jwt);
    }
}

export default JWT;
