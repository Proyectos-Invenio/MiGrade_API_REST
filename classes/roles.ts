import pool from "../environment/environment";

export class Rol {
    public pool = pool;

    public async insertRol(datos: any) {
        const connection = await this.pool.getConnection();
        try {
            await connection.query("CALL sp_crear_rol(?)", [
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

    public async getRol(id: any) {
        const connection = await this.pool.getConnection();
        try {
            const [rows]: any[] = await connection.query(
                'CALL sp_obtener_roles(?)',
                [(id == 0) ? null : id]
            );
            if (rows[0].length > 0) {
                return rows[0];
            } else {
                return {
                    response: "¡El rol no existe!",
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

    public async updateRol(id: any, datos: any) {
        const connection = await this.pool.getConnection();
        try {
            await connection.query("CALL sp_actualizar_rol(?, ?)", [
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

export default Rol;
