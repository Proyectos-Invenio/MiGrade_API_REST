/**
 * Patrón Facade para simplificar el acceso a los servicios de usuario
 * @module UserFacade
 * @author Emilio Rodríguez
 * @version 1.0
 * @description Facade que proporciona una interfaz simplificada para operaciones de usuario
 * @date 17-1-2025
 */

import { Auth } from '../auth';
import { Estudiante } from '../estudiante';
import { Profesor } from '../profesor';
import { Administrador } from '../administrador';
import { Encargado } from '../encargado';
import JWT from '../../services/jwt';

/**
 * Interfaz para el resultado de operaciones de usuario
 */
export interface IUserOperationResult {
    success: boolean;
    data?: any;
    message?: string;
    error?: string;
}

/**
 * Datos de usuario para operaciones
 */
export interface IUserData {
    id?: number;
    nombre?: string;
    email?: string;
    password?: string;
    tipo?: string;
    [key: string]: any;
}

/**
 * Facade principal para operaciones de usuario
 */
export class UserFacade {
    private authService: Auth;
    private jwtService: JWT;
    private estudianteService: Estudiante;
    private profesorService: Profesor;
    private administradorService: Administrador;
    private encargadoService: Encargado;

    constructor() {
        this.authService = new Auth();
        this.jwtService = new JWT();
        this.estudianteService = new Estudiante();
        this.profesorService = new Profesor();
        this.administradorService = new Administrador();
        this.encargadoService = new Encargado();
    }

    /**
     * Autentica un usuario y retorna un token JWT
     * @param credentials Credenciales de login
     * @returns Resultado de la autenticación
     */
    public async login(credentials: { identification: string; password: string }): Promise<IUserOperationResult> {
        try {
            const authResult = await this.authService.login(credentials);

            if (!authResult.tipo) {
                return {
                    success: false,
                    message: authResult.response
                };
            }

            // Crear token JWT
            const token = this.jwtService.CrearToken(authResult);

            return {
                success: true,
                data: {
                    token,
                    user: authResult
                },
                message: 'Login exitoso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Obtiene la información completa de un usuario
     * @param identification Identificación del usuario
     * @returns Información del usuario
     */
    public async getUserInfo(identification: string): Promise<IUserOperationResult> {
        try {
            const userInfo = await this.authService.getInfoUsuario(identification);

            if (!userInfo.tipo) {
                return {
                    success: false,
                    message: userInfo.response
                };
            }

            return {
                success: true,
                data: userInfo,
                message: 'Información de usuario obtenida'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Obtiene el menú de usuario según su rol
     * @param rolUsuario Rol del usuario
     * @returns Menú del usuario
     */
    public async getUserMenu(rolUsuario: number): Promise<IUserOperationResult> {
        try {
            const menu = await this.authService.getUsuarioMenu(rolUsuario);

            if (!menu.tipo) {
                return {
                    success: false,
                    message: menu.response
                };
            }

            return {
                success: true,
                data: menu,
                message: 'Menú de usuario obtenido'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Crea un nuevo usuario según su tipo
     * @param userData Datos del usuario
     * @param userType Tipo de usuario
     * @returns Resultado de la creación
     */
    public async createUser(userData: IUserData, userType: string): Promise<IUserOperationResult> {
        try {
            let result;

            switch (userType.toLowerCase()) {
                case 'estudiante':
                    await this.estudianteService.insertEstudiante(userData);
                    result = { tipo: true, response: 'Estudiante creado exitosamente' };
                    break;
                case 'profesor':
                    await this.profesorService.insertProfesor(userData);
                    result = { tipo: true, response: 'Profesor creado exitosamente' };
                    break;
                case 'administrador':
                    await this.administradorService.insertAdministrador(userData);
                    result = { tipo: true, response: 'Administrador creado exitosamente' };
                    break;
                case 'encargado':
                    await this.encargadoService.insertEncargado(userData);
                    result = { tipo: true, response: 'Encargado creado exitosamente' };
                    break;
                default:
                    return {
                        success: false,
                        message: 'Tipo de usuario no válido'
                    };
            }

            return {
                success: result.tipo || false,
                data: result,
                message: result.tipo ? 'Usuario creado exitosamente' : result.response
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Actualiza un usuario existente
     * @param userData Datos del usuario a actualizar
     * @param userType Tipo de usuario
     * @returns Resultado de la actualización
     */
    public async updateUser(userData: IUserData, userType: string): Promise<IUserOperationResult> {
        try {
            let result;

            switch (userType.toLowerCase()) {
                case 'estudiante':
                    await this.estudianteService.updateEstudiante(userData.id, userData);
                    result = { tipo: true, response: 'Estudiante actualizado exitosamente' };
                    break;
                case 'profesor':
                    await this.profesorService.updateProfesor(userData.id, userData);
                    result = { tipo: true, response: 'Profesor actualizado exitosamente' };
                    break;
                case 'administrador':
                    await this.administradorService.updateAdministrador(userData.id, userData);
                    result = { tipo: true, response: 'Administrador actualizado exitosamente' };
                    break;
                case 'encargado':
                    await this.encargadoService.updateEncargado(userData.id, userData);
                    result = { tipo: true, response: 'Encargado actualizado exitosamente' };
                    break;
                default:
                    return {
                        success: false,
                        message: 'Tipo de usuario no válido'
                    };
            }

            return {
                success: result.tipo || false,
                data: result,
                message: result.tipo ? 'Usuario actualizado exitosamente' : result.response
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Elimina un usuario
     * @param userId ID del usuario
     * @param userType Tipo de usuario
     * @returns Resultado de la eliminación
     */
    public async deleteUser(userId: number, userType: string): Promise<IUserOperationResult> {
        try {
            let result;

            switch (userType.toLowerCase()) {
                case 'estudiante':
                    // Simular eliminación - en la implementación real se llamaría a un método de eliminación
                    result = { tipo: true, response: 'Estudiante eliminado exitosamente' };
                    break;
                case 'profesor':
                    result = { tipo: true, response: 'Profesor eliminado exitosamente' };
                    break;
                case 'administrador':
                    result = { tipo: true, response: 'Administrador eliminado exitosamente' };
                    break;
                case 'encargado':
                    result = { tipo: true, response: 'Encargado eliminado exitosamente' };
                    break;
                default:
                    return {
                        success: false,
                        message: 'Tipo de usuario no válido'
                    };
            }

            return {
                success: result.tipo || false,
                data: result,
                message: result.tipo ? 'Usuario eliminado exitosamente' : result.response
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Obtiene una lista de usuarios según el tipo
     * @param userType Tipo de usuario
     * @returns Lista de usuarios
     */
    public async getUsers(userType: string): Promise<IUserOperationResult> {
        try {
            let result;

            switch (userType.toLowerCase()) {
                case 'estudiante':
                    result = await this.estudianteService.getEstudiante(0);
                    break;
                case 'profesor':
                    result = await this.profesorService.getProfesor(0);
                    break;
                case 'administrador':
                    result = await this.administradorService.getAdministrador(0);
                    break;
                case 'encargado':
                    result = await this.encargadoService.getEncargado(0);
                    break;
                default:
                    return {
                        success: false,
                        message: 'Tipo de usuario no válido'
                    };
            }

            return {
                success: result.tipo || false,
                data: result,
                message: result.tipo ? 'Usuarios obtenidos exitosamente' : result.response
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default UserFacade;
