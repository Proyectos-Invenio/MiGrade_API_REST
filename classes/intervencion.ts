import pool from "../environment/environment";

export class Inventario {
    public pool = pool;

    public constructor() {}

    public async getIntervencion(id: any) {
        const connection = await this.pool.getConnection();
        try {
            const [rows]: any[] = await connection.query(
                "CALL sp_tenant_rw_intervencion(?)",
                [id == 0 ? null : id]
            );
            if (rows[0].length > 0) {
                return rows[0];
            } else {
                return {
                    response: "¡El usuario no existe!",
                    tipo: false,
                };
            }
        } catch (err: any) {
            throw new Error(
                `Se presento un error en el procedimiento ${err.procName}...${err.message}`
            );
        } finally {
            connection.release();
        }
    }
}
export default Inventario;
