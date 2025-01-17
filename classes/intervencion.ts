import pool from '../environment/environment';
import { PoolClient } from 'pg';

export class Inventario {

    public pool = pool;

    public constructor() {}

    public async getIntervencion(id: any) {
        const connection: PoolClient = await this.pool.connect();
        try {
            const result = await connection.query('CALL sp_tenant_rw_intervencion($1)', [(id == 0) ? null : id]);
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
            throw new Error(`Se presento un error en el procedimiento ${err.procName}...${err.message}`);
        } finally {
            connection.release();
        }
    }
}
export default Inventario;
