import { Pool } from 'pg'; // Importar el módulo pg para interactuar con la base de datos PostgreSQL
import pool from '../environment/environment'; // Importar pool desde el archivo de configuración

class Estudiante {
    constructor(
        public cedula: number,
        public nombre: string,
        public email: string,
        public rol: string,
        public grado: string,
        public nivel_educativo: string
    ) {}

    static async obtenerTodos(): Promise<Estudiante[]> {
        const client = await pool.connect();
        try {
            const res = await client.query("SELECT * FROM estudiante");
            return res.rows.map(
                (row) =>
                    new Estudiante(row.cedula, row.nombre, row.email, row.rol, row.grado, row.nivel_educativo)
            );
        } finally {
            client.release();
        }
    }
}

export default Estudiante;
