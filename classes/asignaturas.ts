import pool from "../environment/environment";

export class Asignatura {
    public pool = pool;

    public async insertAsignatura(datos: any) {
        const connection = await this.pool.getConnection();
        try {
            await connection.query("CALL sp_crear_asignatura(?)", [
                datos.nombre
            ]);
        } catch (err: any) {
            throw new Error(
                `Se presentó un error en el procedimiento ${err.procName}...${err.message}`
            );
        } finally {
            connection.release();
        }
    }

    public async getAsignatura(id: any) {
        const connection = await this.pool.getConnection();
        try {
            const [rows]: any[] = await connection.query(
                'CALL sp_obtener_asignaturas(?)',
                [(id == 0) ? null : id]
            );
            if (rows[0].length > 0) {
                return rows[0];
            } else {
                return {
                    response: "¡La asignatura no existe!",
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

    public async updateAsignatura(id: any, datos: any) {
        const connection = await this.pool.getConnection();
        try {
            await connection.query("CALL sp_actualizar_asignatura(?, ?)", [
                id,
                datos.nombre
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

export default Asignatura;
