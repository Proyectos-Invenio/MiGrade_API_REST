import pool from '../environment/environment';
import bcrypt from 'bcrypt';
import { PoolClient } from 'pg';

export class Auth {

    public saltRounds = 10;
    public pool = pool;

    public constructor() {}

    public async login(datos: any) {
        const connection: PoolClient = await this.pool.connect();
        try {
            if (!datos.usuario || !datos.password) {
                return {
                    response: "¡El contenido no puede estar vacío!",
                    tipo: false
                }
            } else {
                const result = await connection.query('CALL sp_tenant_rw_iniciar_sesion($1)', [datos.usuario]);
                const rows = result.rows;
                if (rows.length > 0) {
                    return rows[0];
                } else {
                    return {
                        response: "¡El usuario no existe!",
                        tipo: false
                    }
                }
            }
        } catch (err: any) {
            const procName = err.procName || 'desconocido';
            throw new Error(`Se presentó un error en el procedimiento ${procName}...${err.message}`);
        } finally {
            connection.release();
        }
    }

    public async getInfoUsuario(usuario: any) {
        const connection: PoolClient = await this.pool.connect();
        try {
            const result = await connection.query('CALL sp_tenant_rw_usuario_datos($1)', [usuario]);
            const rows = result.rows;
            if (rows.length > 0) {
                return rows[0];
            } else {
                return {
                    response: "¡El usuario no existe!",
                    tipo: false
                }
            }
        } catch (err: any) {
            throw new Error(`Se presentó un error en el procedimiento ${err.procName}...${err.message}`);
        } finally {
            connection.release();
        }
    }

    public async insertUser(datos: any) {
        const connection: PoolClient = await this.pool.connect();
        try {
            const salt = bcrypt.genSaltSync(this.saltRounds);
            const hash = bcrypt.hashSync(datos.password, salt);
            await connection.query('CALL sp_tenant_crear_usuario($1, $2, $3, $4, $5)', [datos.nombre, datos.usuario, hash, datos.email, datos.pais]);
        } catch (err: any) {
            throw new Error(`Se presentó un error en el procedimiento ${err.procName}...${err.message}`);
        } finally {
            connection.release();
        }
    }

    public async getUsuarios(id_usuario: any) {
        const connection: PoolClient = await this.pool.connect();
        try {
            const result = await connection.query('CALL sp_tenant_usuarios($1)', [(id_usuario == 0) ? null : id_usuario]);
            const rows = result.rows;
            if (rows.length > 0) {
                return rows;
            } else {
                return {
                    response: "¡El usuario no existe!",
                    tipo: false
                }
            }
        } catch (err: any) {
            throw new Error(`Se presentó un error en el procedimiento ${err.procName}...${err.message}`);
        } finally {
            connection.release();
        }
    }

    public async getUsuarioMenu(id_usuario: any) {
        const connection: PoolClient = await this.pool.connect();
        try {
            const result = await connection.query('CALL sp_tenant_usuario_menu($1)', [(id_usuario == 0) ? null : id_usuario]);
            const rows = result.rows;
            if (rows.length > 0) {
                return rows;
            } else {
                return {
                    response: "¡El usuario no tiene menu!",
                    tipo: false
                };
            }
        } catch (err: any) {
            throw new Error(`Se presentó un error en el procedimiento ${err.procName}...${err.message}`);
        } finally {
            connection.release();
        }
    }
}
export default Auth;
