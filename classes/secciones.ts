import pool from "../environment/environment";

export class Seccion {
    public pool = pool;

    public async insertSeccion(datos: any) {
        const connection = await this.pool.getConnection();
        try {
            await connection.query(
                "CALL sp_crear_seccion(?, ?)",
                [
                    datos.seccion,
                    datos.profesor
                ]
            );
        } catch (err: any) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw { success: false, message: "Sección duplicada", status: 400 };
            }
            throw { success: false, message: `Se presentó un error en el procedimiento ${err.procName}...${err.message}`, status: 500 };
        } finally {
            connection.release();
        }
    }

    public async getSeccion(id: any) {
        const connection = await this.pool.getConnection();
        try {
            const [rows]: any[] = await connection.query(
                "CALL sp_obtener_seccion(?)",
                [id == 0 ? null : id]
            );
            if (rows[0].length > 0) {
                return rows[0];
            } else {
                return {
                    response: "¡La sección no existe!",
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

    public async updateSeccion(seccion: any, datos: any) {
        const connection = await this.pool.getConnection();
        try {
            await connection.query(
                "CALL sp_actualizar_seccion( ?, ?)",
                [seccion, datos.profesor]
            );
        } catch (err: any) {
            throw { success: false, message: `Se presentó un error en el procedimiento ${err.procName}...${err.message}`, status: 500 };
        } finally {
            connection.release();
        }
    }
}

export default Seccion;
