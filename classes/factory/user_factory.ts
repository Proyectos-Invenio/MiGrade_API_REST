/**
 * Patrón Factory Method para crear diferentes tipos de usuarios
 * @module UserFactory
 * @author Emilio Rodríguez
 * @version 1.0
 * @description Factory para crear instancias de diferentes tipos de usuarios
 */

import { Auth } from '../auth';
import { Estudiante } from '../estudiante';
import { Profesor } from '../profesor';
import { Administrador } from '../administrador';
import { Encargado } from '../encargado';

/**
 * Interfaz para definir el contrato de los usuarios
 */
export interface IUsuario {
    id: number;
    nombre: string;
    email: string;
    tipo: string;
    obtenerInfo(): any;
}

/**
 * Tipos de usuario disponibles
 */
export enum TipoUsuario {
    ESTUDIANTE = 'estudiante',
    PROFESOR = 'profesor',
    ADMINISTRADOR = 'administrador',
    ENCARGADO = 'encargado'
}

/**
 * Clase abstracta que define el factory method
 */
export abstract class UsuarioFactory {
    /**
     * Factory method abstracto para crear usuarios
     * @param datos Datos del usuario
     * @returns Instancia del usuario correspondiente
     */
    public abstract crearUsuario(datos: any): IUsuario;

    /**
     * Método para obtener información del usuario
     * @param datos Datos del usuario
     * @returns Información del usuario
     */
    public obtenerInformacionUsuario(datos: any): any {
        const usuario = this.crearUsuario(datos);
        return usuario.obtenerInfo();
    }
}

/**
 * Factory concreto para crear estudiantes
 */
export class EstudianteFactory extends UsuarioFactory {
    public crearUsuario(datos: any): IUsuario {
        return new Estudiante(datos);
    }
}

/**
 * Factory concreto para crear profesores
 */
export class ProfesorFactory extends UsuarioFactory {
    public crearUsuario(datos: any): IUsuario {
        return new Profesor(datos);
    }
}

/**
 * Factory concreto para crear administradores
 */
export class AdministradorFactory extends UsuarioFactory {
    public crearUsuario(datos: any): IUsuario {
        return new Administrador(datos);
    }
}

/**
 * Factory concreto para crear encargados
 */
export class EncargadoFactory extends UsuarioFactory {
    public crearUsuario(datos: any): IUsuario {
        return new Encargado(datos);
    }
}

/**
 * Factory principal que maneja la creación de usuarios según el tipo
 */
export class UsuarioFactoryManager {
    private factories: Map<TipoUsuario, UsuarioFactory>;

    constructor() {
        this.factories = new Map();
        this.factories.set(TipoUsuario.ESTUDIANTE, new EstudianteFactory());
        this.factories.set(TipoUsuario.PROFESOR, new ProfesorFactory());
        this.factories.set(TipoUsuario.ADMINISTRADOR, new AdministradorFactory());
        this.factories.set(TipoUsuario.ENCARGADO, new EncargadoFactory());
    }

    /**
     * Crea un usuario según el tipo especificado
     * @param tipo Tipo de usuario
     * @param datos Datos del usuario
     * @returns Instancia del usuario
     */
    public crearUsuario(tipo: TipoUsuario, datos: any): IUsuario {
        const factory = this.factories.get(tipo);
        if (!factory) {
            throw new Error(`Tipo de usuario no soportado: ${tipo}`);
        }
        return factory.crearUsuario(datos);
    }
}

export default UsuarioFactoryManager;
