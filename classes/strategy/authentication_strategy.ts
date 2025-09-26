/**
 * Patrón Strategy para diferentes estrategias de autenticación
 * @module AuthenticationStrategy
 * @author Emilio Rodríguez
 * @version 1.0
 * @description Estrategias de autenticación usando el patrón Strategy
 */

/**
 * Interfaz para las estrategias de autenticación
 */
export interface IAuthenticationStrategy {
    authenticate(credentials: any): Promise<IAuthenticationResult>;
    getStrategyName(): string;
}

/**
 * Resultado de la autenticación
 */
export interface IAuthenticationResult {
    success: boolean;
    user?: any;
    token?: string;
    message?: string;
    error?: string;
}

/**
 * Credenciales de autenticación
 */
export interface IAuthCredentials {
    identification: string;
    password: string;
    [key: string]: any;
}

/**
 * Estrategia de autenticación por email y contraseña
 */
export class EmailPasswordStrategy implements IAuthenticationStrategy {
    public async authenticate(credentials: IAuthCredentials): Promise<IAuthenticationResult> {
        try {
            // Validar formato de email
            if (!this.isValidEmail(credentials.identification)) {
                return {
                    success: false,
                    message: 'Formato de email inválido'
                };
            }

            // Aquí se implementaría la lógica de autenticación por email
            // Por ahora simulamos la autenticación
            const isValid = await this.validateEmailPassword(credentials);

            if (isValid) {
                return {
                    success: true,
                    user: {
                        id: 1,
                        email: credentials.identification,
                        name: 'Usuario Email'
                    },
                    message: 'Autenticación por email exitosa'
                };
            } else {
                return {
                    success: false,
                    message: 'Credenciales inválidas'
                };
            }
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    public getStrategyName(): string {
        return 'EmailPassword';
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private async validateEmailPassword(credentials: IAuthCredentials): Promise<boolean> {
        // Simular validación de credenciales
        return credentials.password.length >= 6;
    }
}

/**
 * Estrategia de autenticación por número de identificación
 */
export class IdentificationStrategy implements IAuthenticationStrategy {
    public async authenticate(credentials: IAuthCredentials): Promise<IAuthenticationResult> {
        try {
            // Validar formato de identificación
            if (!this.isValidIdentification(credentials.identification)) {
                return {
                    success: false,
                    message: 'Formato de identificación inválido'
                };
            }

            // Simular validación de identificación
            const isValid = await this.validateIdentification(credentials);

            if (isValid) {
                return {
                    success: true,
                    user: {
                        id: 2,
                        identification: credentials.identification,
                        name: 'Usuario Identificación'
                    },
                    message: 'Autenticación por identificación exitosa'
                };
            } else {
                return {
                    success: false,
                    message: 'Credenciales inválidas'
                };
            }
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    public getStrategyName(): string {
        return 'Identification';
    }

    private isValidIdentification(identification: string): boolean {
        // Validar que sea un número de identificación válido
        return /^\d{7,15}$/.test(identification);
    }

    private async validateIdentification(credentials: IAuthCredentials): Promise<boolean> {
        // Simular validación de identificación
        return credentials.password.length >= 8;
    }
}

/**
 * Estrategia de autenticación por token
 */
export class TokenStrategy implements IAuthenticationStrategy {
    public async authenticate(credentials: IAuthCredentials): Promise<IAuthenticationResult> {
        try {
            const token = credentials.identification; // En este caso, identification contiene el token

            if (!this.isValidToken(token)) {
                return {
                    success: false,
                    message: 'Token inválido o expirado'
                };
            }

            // Simular validación de token
            const user = await this.validateToken(token);

            if (user) {
                return {
                    success: true,
                    user,
                    message: 'Autenticación por token exitosa'
                };
            } else {
                return {
                    success: false,
                    message: 'Token inválido'
                };
            }
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    public getStrategyName(): string {
        return 'Token';
    }

    private isValidToken(token: string): boolean {
        // Validar formato básico del token
        return token && token.length > 10;
    }

    private async validateToken(token: string): Promise<any> {
        // Simular validación de token
        if (token.startsWith('valid_')) {
            return {
                id: 3,
                token: token,
                name: 'Usuario Token'
            };
        }
        return null;
    }
}

/**
 * Estrategia de autenticación por biometría (simulada)
 */
export class BiometricStrategy implements IAuthenticationStrategy {
    public async authenticate(credentials: IAuthCredentials): Promise<IAuthenticationResult> {
        try {
            const biometricData = credentials.identification; // Datos biométricos

            if (!this.isValidBiometricData(biometricData)) {
                return {
                    success: false,
                    message: 'Datos biométricos inválidos'
                };
            }

            // Simular validación biométrica
            const isValid = await this.validateBiometric(biometricData);

            if (isValid) {
                return {
                    success: true,
                    user: {
                        id: 4,
                        biometricId: biometricData,
                        name: 'Usuario Biométrico'
                    },
                    message: 'Autenticación biométrica exitosa'
                };
            } else {
                return {
                    success: false,
                    message: 'Datos biométricos no coinciden'
                };
            }
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    public getStrategyName(): string {
        return 'Biometric';
    }

    private isValidBiometricData(data: string): boolean {
        // Validar formato de datos biométricos
        return data && data.length > 20;
    }

    private async validateBiometric(data: string): Promise<boolean> {
        // Simular validación biométrica
        return data.includes('biometric_');
    }
}

/**
 * Contexto que utiliza las estrategias de autenticación
 */
export class AuthenticationContext {
    private strategy: IAuthenticationStrategy;

    constructor(strategy: IAuthenticationStrategy) {
        this.strategy = strategy;
    }

    /**
     * Cambia la estrategia de autenticación
     * @param strategy Nueva estrategia
     */
    public setStrategy(strategy: IAuthenticationStrategy): void {
        this.strategy = strategy;
    }

    /**
     * Ejecuta la autenticación usando la estrategia actual
     * @param credentials Credenciales de autenticación
     * @returns Resultado de la autenticación
     */
    public async authenticate(credentials: IAuthCredentials): Promise<IAuthenticationResult> {
        console.log(`Usando estrategia: ${this.strategy.getStrategyName()}`);
        return await this.strategy.authenticate(credentials);
    }

    /**
     * Obtiene el nombre de la estrategia actual
     * @returns Nombre de la estrategia
     */
    public getCurrentStrategyName(): string {
        return this.strategy.getStrategyName();
    }
}

/**
 * Factory para crear estrategias de autenticación
 */
export class AuthenticationStrategyFactory {
    /**
     * Crea una estrategia según el tipo especificado
     * @param type Tipo de estrategia
     * @returns Estrategia de autenticación
     */
    public static createStrategy(type: string): IAuthenticationStrategy {
        switch (type.toLowerCase()) {
            case 'email':
                return new EmailPasswordStrategy();
            case 'identification':
                return new IdentificationStrategy();
            case 'token':
                return new TokenStrategy();
            case 'biometric':
                return new BiometricStrategy();
            default:
                throw new Error(`Tipo de estrategia no soportado: ${type}`);
        }
    }

    /**
     * Obtiene todas las estrategias disponibles
     * @returns Lista de estrategias disponibles
     */
    public static getAvailableStrategies(): string[] {
        return ['email', 'identification', 'token', 'biometric'];
    }
}

/**
 * Manager para el sistema de autenticación
 */
export class AuthenticationManager {
    private static instance: AuthenticationManager;
    private context: AuthenticationContext;
    private strategies: Map<string, IAuthenticationStrategy> = new Map();

    private constructor() {
        this.initializeStrategies();
        this.context = new AuthenticationContext(this.strategies.get('email')!);
    }

    /**
     * Obtiene la instancia única del manager
     * @returns Instancia del AuthenticationManager
     */
    public static getInstance(): AuthenticationManager {
        if (!AuthenticationManager.instance) {
            AuthenticationManager.instance = new AuthenticationManager();
        }
        return AuthenticationManager.instance;
    }

    /**
     * Inicializa todas las estrategias disponibles
     */
    private initializeStrategies(): void {
        this.strategies.set('email', new EmailPasswordStrategy());
        this.strategies.set('identification', new IdentificationStrategy());
        this.strategies.set('token', new TokenStrategy());
        this.strategies.set('biometric', new BiometricStrategy());
    }

    /**
     * Autentica usando una estrategia específica
     * @param strategyType Tipo de estrategia
     * @param credentials Credenciales
     * @returns Resultado de la autenticación
     */
    public async authenticateWithStrategy(
        strategyType: string,
        credentials: IAuthCredentials
    ): Promise<IAuthenticationResult> {
        const strategy = this.strategies.get(strategyType);
        if (!strategy) {
            return {
                success: false,
                message: `Estrategia ${strategyType} no disponible`
            };
        }

        this.context.setStrategy(strategy);
        return await this.context.authenticate(credentials);
    }

    /**
     * Obtiene las estrategias disponibles
     * @returns Lista de estrategias disponibles
     */
    public getAvailableStrategies(): string[] {
        return Array.from(this.strategies.keys());
    }
}

export default AuthenticationManager;
