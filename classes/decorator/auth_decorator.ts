/**
 * Patrón Decorator para añadir funcionalidades de autenticación y autorización
 * @module AuthDecorator
 * @author Emilio Rodríguez
 * @version 1.0
 * @description Decorator para añadir funcionalidades de seguridad a los servicios
 */

import { Request, Response, NextFunction } from 'express';
import JWT from '../services/jwt';

/**
 * Interfaz base para los servicios que pueden ser decorados
 */
export interface IService {
    execute(data: any): Promise<any>;
}

/**
 * Decorator base abstracto
 */
export abstract class ServiceDecorator implements IService {
    protected service: IService;

    constructor(service: IService) {
        this.service = service;
    }

    public async execute(data: any): Promise<any> {
        return await this.service.execute(data);
    }
}

/**
 * Decorator para validación de autenticación
 */
export class AuthenticationDecorator extends ServiceDecorator {
    public async execute(data: any): Promise<any> {
        // Validar token JWT
        if (!data.token) {
            throw new Error('Token de autenticación requerido');
        }

        try {
            // Aquí se validaría el token JWT
            const jwt = new JWT();
            // const decoded = jwt.verifyToken(data.token);

            // Si la validación es exitosa, proceder con el servicio original
            return await super.execute(data);
        } catch (error) {
            throw new Error('Token de autenticación inválido');
        }
    }
}

/**
 * Decorator para validación de autorización por roles
 */
export class AuthorizationDecorator extends ServiceDecorator {
    private requiredRoles: string[];

    constructor(service: IService, requiredRoles: string[]) {
        super(service);
        this.requiredRoles = requiredRoles;
    }

    public async execute(data: any): Promise<any> {
        // Validar que el usuario tenga los roles necesarios
        if (!data.userRoles || !this.hasRequiredRoles(data.userRoles)) {
            throw new Error('No tiene permisos para realizar esta acción');
        }

        return await super.execute(data);
    }

    private hasRequiredRoles(userRoles: string[]): boolean {
        return this.requiredRoles.some(role => userRoles.includes(role));
    }
}

/**
 * Decorator para logging de operaciones
 */
export class LoggingDecorator extends ServiceDecorator {
    public async execute(data: any): Promise<any> {
        const startTime = Date.now();

        try {
            console.log(`[${new Date().toISOString()}] Iniciando operación:`, {
                service: this.service.constructor.name,
                data: this.sanitizeData(data)
            });

            const result = await super.execute(data);

            const duration = Date.now() - startTime;
            console.log(`[${new Date().toISOString()}] Operación completada en ${duration}ms`);

            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            console.error(`[${new Date().toISOString()}] Error en operación después de ${duration}ms:`, error);
            throw error;
        }
    }

    private sanitizeData(data: any): any {
        // Remover información sensible antes del logging
        const sanitized = { ...data };
        if (sanitized.password) delete sanitized.password;
        if (sanitized.token) delete sanitized.token;
        return sanitized;
    }
}

/**
 * Decorator para validación de datos de entrada
 */
export class ValidationDecorator extends ServiceDecorator {
    private validationRules: any;

    constructor(service: IService, validationRules: any) {
        super(service);
        this.validationRules = validationRules;
    }

    public async execute(data: any): Promise<any> {
        this.validateData(data);
        return await super.execute(data);
    }

    private validateData(data: any): void {
        for (const [field, rules] of Object.entries(this.validationRules)) {
            if (rules.required && !data[field]) {
                throw new Error(`El campo ${field} es requerido`);
            }

            if (data[field] && rules.type) {
                if (rules.type === 'email' && !this.isValidEmail(data[field])) {
                    throw new Error(`El campo ${field} debe ser un email válido`);
                }

                if (rules.type === 'number' && isNaN(data[field])) {
                    throw new Error(`El campo ${field} debe ser un número`);
                }
            }
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

/**
 * Factory para crear decorators combinados
 */
export class DecoratorFactory {
    /**
     * Crea un servicio con decorators de autenticación y autorización
     */
    public static createSecureService(
        service: IService,
        requiredRoles: string[] = []
    ): IService {
        let decoratedService: IService = new AuthenticationDecorator(service);

        if (requiredRoles.length > 0) {
            decoratedService = new AuthorizationDecorator(decoratedService, requiredRoles);
        }

        decoratedService = new LoggingDecorator(decoratedService);

        return decoratedService;
    }

    /**
     * Crea un servicio con validación y logging
     */
    public static createValidatedService(
        service: IService,
        validationRules: any
    ): IService {
        return new LoggingDecorator(
            new ValidationDecorator(service, validationRules)
        );
    }
}

export default DecoratorFactory;
