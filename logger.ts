// Determina el objeto global dependiendo del entorno (navegador, Node.js, etc.)
const globalObject = typeof globalThis !== 'undefined' ? globalThis :
                     typeof global !== 'undefined' ? global :
                     typeof window !== 'undefined' ? window :
                     {};

// Importa las funciones necesarias de la biblioteca winston
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;

// Define el formato de los mensajes de log
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Crea y configura el logger
const logger = createLogger({
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.File({ filename: 'errors.log', level: 'error' })
    ]
});

// Función para registrar mensajes de error
const logError = (message: string): void => {
    logger.error(message);
};

// Exporta la función logError
export { logError };
