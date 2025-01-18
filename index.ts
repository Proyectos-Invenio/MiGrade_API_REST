// Importaciones de los módulos necesarios
import bodyParser from "body-parser"; // Importa el módulo bodyParser para analizar el cuerpo de las solicitudes
import cors from "cors"; // Importa el módulo cors para habilitar el intercambio de recursos entre diferentes orígenes
import { Request, Response, NextFunction } from "express"; // Importar tipos de Express
import Servidor from "./classes/servidor"; // Importa la clase Servidor desde el archivo './classes/servidor'
import { logError } from "./logger"; // Importar logError
import AppRouter from "./routes/app.routes"; // Importa las rutas de la aplicación desde el archivo './routes/app.routes'
import AuthRouter from "./routes/auth.routes";

// Definición de la clase Aplicacion
class Aplicacion {
    private servidor: Servidor; // Declara una variable privada servidor de tipo Servidor

    // Constructor de la clase Aplicacion
    constructor() {
        this.servidor = Servidor.instance; // Inicializa la variable servidor con una instancia de la clase Servidor
        this.configurarMiddlewares(); // Configura los middlewares de la aplicación
        this.configurarRutas(); // Configura las rutas de la aplicación
        this.configurarManejoErrores(); // Configurar el manejo de errores
        this.iniciarServidor(); // Inicia el servidor
    }

    // Método privado para configurar los middlewares de la aplicación
    private configurarMiddlewares(): void {
        // Utiliza bodyParser para analizar el cuerpo de las solicitudes en formato URL codificado y JSON
        this.servidor.app.use(
            bodyParser.urlencoded({ limit: "150mb", extended: true })
        );
        this.servidor.app.use(bodyParser.json({ limit: "150mb" }));
        // Habilita el intercambio de recursos entre diferentes orígenes (CORS)
        this.servidor.app.use(cors({ origin: true, credentials: true }));
    }

    // Método privado para configurar las rutas de la aplicación
    private configurarRutas(): void {
        // Asocia las rutas de la aplicación bajo el prefijo '/api/' utilizando el enrutador de AppRouter
        this.servidor.app.use("/api/", [
            AppRouter,
            AuthRouter
        ]);
    }

    // Método privado para configurar el manejo de errores
    private configurarManejoErrores(): void {
        this.servidor.app.use(
            (err: Error, req: Request, res: Response, next: NextFunction) => {
                logError(err.message); // Registrar el error
                res.status(500).json({
                    error: "Ocurrió un error en el servidor",
                });
            }
        );
    }

    // Método privado para iniciar el servidor
    private iniciarServidor(): void {
        // Inicia el servidor y muestra un mensaje indicando el puerto en el que está corriendo
        this.servidor.start(() => {
            console.log(
                `MiGrade API corriendo en el puerto ${this.servidor.port}`
            );
        });
    }
}

// Crea una nueva instancia de la clase Aplicacion para iniciar la aplicación
new Aplicacion();
