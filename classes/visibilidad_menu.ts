import pool from "../environment/environment";

export class VisibilidadMenu {
    public pool = pool;

    public async insertVisibilidadMenu(datos: any) {
        const connection = await this.pool.getConnection();
        try {
            await connection.query("CALL sp_crear_visibilidad_menu(?, ?)", [
                datos.rol_id,
                datos.elemento_menu_id
            ]);
        } catch (err: any) {
            throw new Error(
                `Se presentó un error en el procedimiento ${err.procName}...${err.message}`
            );
        } finally {
            connection.release();
        }
    }

    public async getVisibilidadMenu(id: any) {
        const connection = await this.pool.getConnection();
        try {
            const [rows]: any[] = await connection.query(
                'CALL sp_obtener_visibilidad_menu(?)',
                [(id == 0) ? null : id]
            );
            if (rows[0].length > 0) {
                return rows[0];
            } else {
                return {
                    response: "¡La visibilidad del menú no existe!",
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

    public async updateVisibilidadMenu(id: any, datos: any) {
        const connection = await this.pool.getConnection();
        try {
            await connection.query("CALL sp_actualizar_visibilidad_menu(?, ?)", [
                id,
                datos.rol_id,
                datos.elemento_menu_id
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

export default VisibilidadMenu;
