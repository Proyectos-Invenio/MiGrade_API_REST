import pool from "../environment/environment";
import bcrypt from "bcrypt";

export class Padre {
    public saltRounds = 10;
    public pool = pool;

    public async insertPadre(datos: any) {
        const connection = await this.pool.getConnection();
        try {
            const salt = bcrypt.genSaltSync(this.saltRounds);
            const hash = bcrypt.hashSync(datos.password, salt);
            await connection.query("CALL sp_crear_padres(?, ?, ?, ?, ?)", [
                datos.identification,
                datos.nombre,
                datos.informacion,
                datos.email,
                hash
            ]);
        } catch (err: any) {
            throw new Error(
                `Se presentó un error en el procedimiento ${err.procName}...${err.message}`
            );
        } finally {
            connection.release();
        }
    }

    public async getPadre(id: any) {
        const connection = await this.pool.getConnection();
        try {
            const [rows]: any[] = await connection.query(
                'CALL sp_obtener_padre(?)',
                [(id == 0) ? null : id]
            );
            if (rows[0].length > 0) {
                return rows[0];
            } else {
                return {
                    response: "¡El padre no existe!",
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

    public async updatePadre(id: any, datos: any) {
        const connection = await this.pool.getConnection();
        try {
            await connection.query("CALL sp_actualizar_padre(?, ?, ?, ?)", [
                id,
                datos.nombre,
                datos.informacion,
                datos.email
            ]);
        } catch (err: any) {
            throw new Error(
                `Se presentó un error en el procedimiento ${err.procName}...${err.message}`
            );
        } finally {
            connection.release();
        }
    }
}

export default Padre;
