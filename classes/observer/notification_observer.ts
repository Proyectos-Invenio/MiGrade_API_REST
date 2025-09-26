/**
 * Patrón Observer para el sistema de notificaciones
 * @module NotificationObserver
 * @author Emilio Rodríguez
 * @version 1.0
 * @description Sistema de notificaciones basado en el patrón Observer
 */

/**
 * Interfaz para los observadores (suscriptores)
 */
export interface IObserver {
    update(data: any): void;
    getId(): string;
}

/**
 * Interfaz para el sujeto observable
 */
export interface ISubject {
    attach(observer: IObserver): void;
    detach(observer: IObserver): void;
    notify(data: any): void;
}

/**
 * Tipos de eventos que pueden ser observados
 */
export enum EventType {
    USER_LOGIN = 'user_login',
    USER_LOGOUT = 'user_logout',
    USER_CREATED = 'user_created',
    USER_UPDATED = 'user_updated',
    USER_DELETED = 'user_deleted',
    GRADE_ADDED = 'grade_added',
    GRADE_UPDATED = 'grade_updated',
    ANNOUNCEMENT_CREATED = 'announcement_created',
    SYSTEM_ERROR = 'system_error'
}

/**
 * Datos del evento
 */
export interface IEventData {
    type: EventType;
    timestamp: Date;
    userId?: number;
    data: any;
    message: string;
}

/**
 * Sujeto observable para eventos del sistema
 */
export class EventSubject implements ISubject {
    private observers: Map<string, IObserver> = new Map();
    private eventHistory: IEventData[] = [];

    /**
     * Adjunta un observador al sujeto
     * @param observer Observador a adjuntar
     */
    public attach(observer: IObserver): void {
        this.observers.set(observer.getId(), observer);
        console.log(`Observador ${observer.getId()} adjuntado`);
    }

    /**
     * Desadjunta un observador del sujeto
     * @param observer Observador a desadjuntar
     */
    public detach(observer: IObserver): void {
        this.observers.delete(observer.getId());
        console.log(`Observador ${observer.getId()} desadjuntado`);
    }

    /**
     * Notifica a todos los observadores sobre un evento
     * @param data Datos del evento
     */
    public notify(data: IEventData): void {
        this.eventHistory.push(data);
        console.log(`Notificando evento ${data.type} a ${this.observers.size} observadores`);

        this.observers.forEach(observer => {
            try {
                observer.update(data);
            } catch (error) {
                console.error(`Error notificando al observador ${observer.getId()}:`, error);
            }
        });
    }

    /**
     * Obtiene el historial de eventos
     * @returns Historial de eventos
     */
    public getEventHistory(): IEventData[] {
        return [...this.eventHistory];
    }

    /**
     * Obtiene el número de observadores
     * @returns Número de observadores
     */
    public getObserverCount(): number {
        return this.observers.size;
    }
}

/**
 * Observador para logging de eventos
 */
export class LoggingObserver implements IObserver {
    private id: string;

    constructor(id: string = 'logging-observer') {
        this.id = id;
    }

    public update(data: IEventData): void {
        console.log(`[LOGGING] ${data.timestamp.toISOString()} - ${data.type}: ${data.message}`);
    }

    public getId(): string {
        return this.id;
    }
}

/**
 * Observador para notificaciones por email
 */
export class EmailNotificationObserver implements IObserver {
    private id: string;

    constructor(id: string = 'email-notification-observer') {
        this.id = id;
    }

    public update(data: IEventData): void {
        // Simular envío de email
        console.log(`[EMAIL] Enviando notificación por email: ${data.message}`);
        console.log(`[EMAIL] Destinatario: Usuario ${data.userId || 'Sistema'}`);
    }

    public getId(): string {
        return this.id;
    }
}

/**
 * Observador para notificaciones push
 */
export class PushNotificationObserver implements IObserver {
    private id: string;

    constructor(id: string = 'push-notification-observer') {
        this.id = id;
    }

    public update(data: IEventData): void {
        // Simular notificación push
        console.log(`[PUSH] Enviando notificación push: ${data.message}`);
        console.log(`[PUSH] Tipo de evento: ${data.type}`);
    }

    public getId(): string {
        return this.id;
    }
}

/**
 * Observador para auditoría
 */
export class AuditObserver implements IObserver {
    private id: string;
    private auditLog: IEventData[] = [];

    constructor(id: string = 'audit-observer') {
        this.id = id;
    }

    public update(data: IEventData): void {
        this.auditLog.push(data);
        console.log(`[AUDIT] Registrando evento de auditoría: ${data.type}`);
    }

    public getId(): string {
        return this.id;
    }

    /**
     * Obtiene el log de auditoría
     * @returns Log de auditoría
     */
    public getAuditLog(): IEventData[] {
        return [...this.auditLog];
    }
}

/**
 * Observador para métricas del sistema
 */
export class MetricsObserver implements IObserver {
    private id: string;
    private metrics: Map<EventType, number> = new Map();

    constructor(id: string = 'metrics-observer') {
        this.id = id;
    }

    public update(data: IEventData): void {
        const currentCount = this.metrics.get(data.type) || 0;
        this.metrics.set(data.type, currentCount + 1);
        console.log(`[METRICS] Evento ${data.type} registrado. Total: ${currentCount + 1}`);
    }

    public getId(): string {
        return this.id;
    }

    /**
     * Obtiene las métricas del sistema
     * @returns Métricas por tipo de evento
     */
    public getMetrics(): Map<EventType, number> {
        return new Map(this.metrics);
    }

    /**
     * Obtiene el total de eventos registrados
     * @returns Total de eventos
     */
    public getTotalEvents(): number {
        return Array.from(this.metrics.values()).reduce((total, count) => total + count, 0);
    }
}

/**
 * Manager para el sistema de notificaciones
 */
export class NotificationManager {
    private static instance: NotificationManager;
    private eventSubject: EventSubject;
    private observers: Map<string, IObserver> = new Map();

    private constructor() {
        this.eventSubject = new EventSubject();
        this.initializeDefaultObservers();
    }

    /**
     * Obtiene la instancia única del manager
     * @returns Instancia del NotificationManager
     */
    public static getInstance(): NotificationManager {
        if (!NotificationManager.instance) {
            NotificationManager.instance = new NotificationManager();
        }
        return NotificationManager.instance;
    }

    /**
     * Inicializa los observadores por defecto
     */
    private initializeDefaultObservers(): void {
        const loggingObserver = new LoggingObserver();
        const emailObserver = new EmailNotificationObserver();
        const pushObserver = new PushNotificationObserver();
        const auditObserver = new AuditObserver();
        const metricsObserver = new MetricsObserver();

        this.observers.set(loggingObserver.getId(), loggingObserver);
        this.observers.set(emailObserver.getId(), emailObserver);
        this.observers.set(pushObserver.getId(), pushObserver);
        this.observers.set(auditObserver.getId(), auditObserver);
        this.observers.set(metricsObserver.getId(), metricsObserver);

        // Adjuntar todos los observadores al sujeto
        this.observers.forEach(observer => {
            this.eventSubject.attach(observer);
        });
    }

    /**
     * Publica un evento en el sistema
     * @param type Tipo de evento
     * @param data Datos del evento
     * @param message Mensaje descriptivo
     * @param userId ID del usuario (opcional)
     */
    public publishEvent(type: EventType, data: any, message: string, userId?: number): void {
        const eventData: IEventData = {
            type,
            timestamp: new Date(),
            userId,
            data,
            message
        };

        this.eventSubject.notify(eventData);
    }

    /**
     * Añade un nuevo observador
     * @param observer Observador a añadir
     */
    public addObserver(observer: IObserver): void {
        this.observers.set(observer.getId(), observer);
        this.eventSubject.attach(observer);
    }

    /**
     * Remueve un observador
     * @param observerId ID del observador a remover
     */
    public removeObserver(observerId: string): void {
        const observer = this.observers.get(observerId);
        if (observer) {
            this.eventSubject.detach(observer);
            this.observers.delete(observerId);
        }
    }

    /**
     * Obtiene el historial de eventos
     * @returns Historial de eventos
     */
    public getEventHistory(): IEventData[] {
        return this.eventSubject.getEventHistory();
    }

    /**
     * Obtiene las métricas del sistema
     * @returns Métricas del sistema
     */
    public getSystemMetrics(): Map<EventType, number> {
        const metricsObserver = this.observers.get('metrics-observer') as MetricsObserver;
        return metricsObserver ? metricsObserver.getMetrics() : new Map();
    }
}

export default NotificationManager;
