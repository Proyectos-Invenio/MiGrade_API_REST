/**
 * Módulo para crear y configurar un servidor Express.
 */
import express, { Application } from 'express';
import http, { Server } from 'http';

import { SERVER_PORT } from '../environment/environment';

/**
 * Clase que representa un servidor Express.
 */
export class Servidor {

    /**
     * Instancia única del servidor.
     */
    private static _instance: Servidor;

    /**
     * Aplicación Express.
     */
    public app: Application;

    /**
     * Puerto en el que se ejecutará el servidor.
     */
    public port: number;

    /**
     * Servidor HTTP.
     */
    private httpServer: Server;

    /**
     * Constructor privado para crear una instancia de Servidor.
     * Se inicializa la aplicación Express y se crea un servidor HTTP.
     */
    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server(this.app);
    }

    /**
     * Método estático para obtener la instancia única del servidor.
     * Si la instancia no existe, se crea una nueva.
     * @returns La instancia única del servidor.
     */
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    /**
     * Método para iniciar el servidor y escuchar peticiones en el puerto especificado.
     * @param callback Función opcional a llamar una vez que el servidor se haya iniciado correctamente.
     */
    start(callback?: () => void) {
        this.httpServer.timeout = 0;
        this.httpServer.listen(this.port, callback);
    }
}

export default Servidor;