import pool from "../environment/environment";
import bcrypt from "bcrypt";

export class Estudiante {
    public saltRounds = 10;
    public pool = pool;

    public async insertEstudiante(datos: any) {
        const connection = await this.pool.getConnection();
        try {
            const salt = bcrypt.genSaltSync(this.saltRounds);
            const hash = bcrypt.hashSync(datos.password, salt);
            await connection.query(
                "CALL sp_crear_estudiante(?, ?, ?, ?, ?, ?, ?)",
                [
                    datos.identification,
                    datos.nombre,
                    datos.encargado,
                    datos.email,
                    hash,
                    datos.sexo,
                    datos.seccion
                ]
            );
        } catch (err: any) {
            throw new Error(
                `Se presentó un error en el procedimiento ${err.procName}...${err.message}`
            );
        } finally {
            connection.release();
        }
    }

    public async getEstudiante(id: any) {
        const connection = await this.pool.getConnection();
        try {
            const [rows]: any[] = await connection.query(
                "CALL sp_obtener_estudiante(?)",
                [id == 0 ? null : id]
            );
            if (rows[0].length > 0) {
                return rows[0];
            } else {
                return {
                    response: "¡El estudiante no existe!",
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

    public async updateEstudiante(id: any, datos: any) {
        const connection = await this.pool.getConnection();
        try {
            await connection.query(
                "CALL sp_actualizar_estudiante(?, ?, ?, ?)",
                [id, datos.nombre, datos.padre, datos.email]
            );
        } catch (err: any) {
            throw new Error(
                `Se presentó un error en el procedimiento ${err.procName}...${err.message}`
            );
        } finally {
            connection.release();
        }
    }
}

export default Estudiante;
