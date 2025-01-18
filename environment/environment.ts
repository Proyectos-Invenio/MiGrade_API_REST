import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();
/**
 * Configuración de la aplicación.
 * Este módulo proporciona la configuración básica para la aplicación, incluyendo variables de entorno y configuración de base de datos.
 * @module Configuracion
 * @author Emilio Rodríguez
 * @version 1.0
 * @description Configuración de la aplicación, incluyendo variables de entorno y configuración de base de datos.
 * @date 17-1-2025
 */

// Puerto de la aplicación. En el entorno de desarrollo, se toma del valor de SERVER_PORT del entorno, o de lo contrario, se utiliza el puerto predeterminado 5002.
export const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 443;

/**
 * Clave Secreta para la generación de tokens JWT.
 * Generada utilizando el método Fort Knox Passwords.
 * @constant {string} clave_secreta - La clave secreta utilizada para firmar los tokens JWT.
 */
export const clave_secreta =
    process.env.JWT_SECRET || ",2>vJC-!{]+OQcI?b_@@i0[}/Rx&{_";

// Validación de variables de entorno críticas
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        console.error(`Error: La variable de entorno ${key} no está definida.`);
        process.exit(1); // Salir del proceso si faltan configuraciones críticas
    }
});

// Configuración del pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 20,
    queueLimit: 0,
    connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT) || 10000, // 10 segundos
    enableKeepAlive: true, // Habilitar conexiones persistentes para producción
    keepAliveInitialDelay: 30000, // 30 segundos antes de iniciar Keep-Alive
});

// Configurar cada nueva conexión
pool.on("connection", (connection) => {
    console.log("Nueva conexión establecida en el pool.");

    // Establecer el wait_timeout de la sesión a 2 minutos (120 segundos)
    connection.query("SET SESSION wait_timeout = 120", (err: any) => {
        if (err) {
            console.error("Error al establecer el wait_timeout:", err);
        } else {
            console.log("wait_timeout configurado a 120 segundos.");
        }
    });
});

// Manejo de errores en el pool de conexiones
pool.on("enqueue", () => {
    console.warn("Una conexión ha sido encolada.");
    // Opcional: notificar el evento o realizar alguna acción si es necesario
});
export default pool;
