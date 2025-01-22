import pool from "../environment/environment";
import bcrypt from "bcrypt";

export class Auth {
    public saltRounds = 10;
    public pool = pool;

    public constructor() {}

    public async login(datos: any) {
        const connection = await this.pool.getConnection();
        try {
            if (!datos.identification || !datos.password) {
                return {
                    response: "¡El contenido no puede estar vacío!",
                    tipo: false,
                };
            } else {
                const [rows]: any[] = await connection.query(
                    "CALL sp_iniciar_sesion(?)",
                    [datos.identification]
                );
                if (rows[0].length > 0) {
                    return rows[0][0];
                } else {
                    return {
                        response: "¡El usuario no existe!",
                        tipo: false,
                    };
                }
            }
        } catch (err: any) {
            const procName = err.procName || "desconocido";
            throw new Error(
                `Se presentó un error en el procedimiento ${procName}...${err.message}`
            );
        } finally {
            connection.release();
        }
    }

    public async getInfoUsuario(identification: any) {
        const connection = await this.pool.getConnection();
        try {
            const [rows]: any[] = await connection.query(
                "CALL sp_usuario_datos(?)",
                [identification]
            );

            if (rows[0].length > 0) {
                return rows[0][0];
            } else {
                return {
                    response: "¡El usuario no existe!",
                    tipo: false,
                };
            }
        } catch (err: any) {
            throw new Error(
                `Se presentó un error en el procedimiento ${err.procName}...${err.message}`
            );
        } finally {
            connection.release();
        }
    }

    public async getUsuarioMenu(rol_usuario: any) {
        const connection = await this.pool.getConnection();
        try {
            const [rows]: any[] = await connection.query(
                "CALL sp_menu_usuario(?)",
                [rol_usuario == 0 ? null : rol_usuario]
            );
            if (rows[0].length > 0) {
                return rows[0];
            } else {
                return {
                    response: "¡El usuario no tiene menu!",
                    tipo: false,
                };
            }
        } catch (err: any) {
            throw new Error(
                `Se presentó un error en el procedimiento ${err.procName}...${err.message}`
            );
        } finally {
            connection.release();
        }
    }
}
export default Auth;
