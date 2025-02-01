import pool from "../environment/environment";

export class Anuncios {
    public pool = pool;

    public async insertAnuncio(datos: any) {
        const connection = await this.pool.getConnection();
        try {
            await connection.query("CALL sp_crear_anuncio(?, ?, ?)", [
                datos.titulo,
                datos.contenido,
                datos.fecha
            ]);
        } catch (err: any) {
            throw new Error(
                `Se presentó un error en el procedimiento ${err.procName}...${err.message}`
            );
        } finally {
            connection.release();
        }
    }

    public async getAnuncio(id: any) {
        const connection = await this.pool.getConnection();
        try {
            const [rows]: any[] = await connection.query(
                'CALL sp_obtener_anuncio(?)',
                [(id == 0) ? null : id]
            );
            if (rows[0].length > 0) {
                return rows[0];
            } else {
                return {
                    response: "¡El anuncio no existe!",
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

    public async updateAnuncio(id: any, datos: any) {
        const connection = await this.pool.getConnection();
        try {
            await connection.query("CALL sp_actualizar_anuncio(?, ?, ?)", [
                id,
                datos.titulo,
                datos.contenido,
                datos.fecha
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

export default Anuncios;
