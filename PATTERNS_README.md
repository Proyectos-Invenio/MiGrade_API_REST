# Patrones de Diseño Implementados en MiGrade API

Este documento describe los patrones de diseño implementados en el proyecto MiGrade API REST.

## 📋 Resumen de Patrones Implementados

### Patrones Creacionales

-   ✅ **Singleton** (ya implementado en `Servidor`)
-   ✅ **Factory Method** (nuevo)
-   ✅ **Builder** (nuevo)

### Patrones Estructurales

-   ✅ **Decorator** (nuevo)
-   ✅ **Facade** (nuevo)

### Patrones de Comportamiento

-   ✅ **Observer** (nuevo)
-   ✅ **Strategy** (nuevo)

## 🏗️ Patrones Creacionales

### 1. Singleton (Ya implementado)

**Ubicación:** `classes/servidor.ts`

El patrón Singleton ya estaba implementado en la clase `Servidor` para asegurar que solo exista una instancia del servidor en toda la aplicación.

```typescript
export class Servidor {
    private static _instance: Servidor;

    public static get instance() {
        return this._instance || (this._instance = new this());
    }
}
```

### 2. Factory Method

**Ubicación:** `classes/factory/user_factory.ts`

Permite crear diferentes tipos de usuarios sin especificar sus clases concretas.

```typescript
const factoryManager = new UsuarioFactoryManager();
const estudiante = factoryManager.crearUsuario(TipoUsuario.ESTUDIANTE, datos);
```

**Características:**

-   Interfaz `IUsuario` para todos los tipos de usuario
-   Factory abstracto `UsuarioFactory`
-   Factories concretos para cada tipo de usuario
-   Manager centralizado para la creación

### 3. Builder

**Ubicación:** `classes/builder/query_builder.ts`

Construye consultas SQL complejas de manera fluida y legible.

```typescript
const query = new QueryBuilder()
    .select(["id", "nombre", "email"])
    .from("usuarios")
    .where("estado = 1")
    .orderBy("nombre", "ASC")
    .limit(10)
    .build();
```

**Características:**

-   Construcción paso a paso
-   Director para consultas predefinidas
-   Validación de consultas
-   Reutilización de componentes

## 🏛️ Patrones Estructurales

### 4. Decorator

**Ubicación:** `classes/decorator/auth_decorator.ts`

Añade funcionalidades de seguridad, logging y validación a los servicios existentes.

```typescript
const servicioSeguro = DecoratorFactory.createSecureService(servicio, [
    "admin",
]);
const servicioValidado = DecoratorFactory.createValidatedService(
    servicio,
    reglas
);
```

**Decorators implementados:**

-   `AuthenticationDecorator`: Validación de tokens JWT
-   `AuthorizationDecorator`: Control de acceso por roles
-   `LoggingDecorator`: Registro de operaciones
-   `ValidationDecorator`: Validación de datos de entrada

### 5. Facade

**Ubicación:** `classes/facade/user_facade.ts`

Proporciona una interfaz simplificada para operaciones complejas de usuario.

```typescript
const userFacade = new UserFacade();
const result = await userFacade.login(credentials);
const user = await userFacade.createUser(data, "estudiante");
```

**Funcionalidades:**

-   Login unificado
-   Creación de usuarios por tipo
-   Actualización y eliminación
-   Obtención de información
-   Manejo de menús de usuario

## 🎭 Patrones de Comportamiento

### 6. Observer

**Ubicación:** `classes/observer/notification_observer.ts`

Sistema de notificaciones basado en eventos con múltiples observadores.

```typescript
const notificationManager = NotificationManager.getInstance();
notificationManager.publishEvent(EventType.USER_LOGIN, data, message, userId);
```

**Observadores implementados:**

-   `LoggingObserver`: Registro de eventos
-   `EmailNotificationObserver`: Notificaciones por email
-   `PushNotificationObserver`: Notificaciones push
-   `AuditObserver`: Auditoría del sistema
-   `MetricsObserver`: Métricas y estadísticas

### 7. Strategy

**Ubicación:** `classes/strategy/authentication_strategy.ts`

Diferentes estrategias de autenticación intercambiables en tiempo de ejecución.

```typescript
const authManager = AuthenticationManager.getInstance();
const result = await authManager.authenticateWithStrategy("email", credentials);
```

**Estrategias implementadas:**

-   `EmailPasswordStrategy`: Autenticación por email
-   `IdentificationStrategy`: Autenticación por identificación
-   `TokenStrategy`: Autenticación por token
-   `BiometricStrategy`: Autenticación biométrica

## 📁 Estructura de Archivos

```
classes/
├── factory/
│   └── user_factory.ts          # Factory Method
├── builder/
│   └── query_builder.ts         # Builder
├── decorator/
│   └── auth_decorator.ts         # Decorator
├── facade/
│   └── user_facade.ts            # Facade
├── observer/
│   └── notification_observer.ts  # Observer
├── strategy/
│   └── authentication_strategy.ts # Strategy
└── servidor.ts                   # Singleton (ya existente)

examples/
└── patterns_usage_example.ts     # Ejemplos de uso
```

## 🚀 Cómo Usar los Patrones

### Ejecutar Ejemplos

```bash
# Compilar TypeScript
npm run build

# Ejecutar ejemplos
node dist/examples/patterns_usage_example.js
```

### Integración en el Proyecto

1. **Factory Method**: Usar `UsuarioFactoryManager` para crear usuarios
2. **Builder**: Usar `QueryBuilder` para consultas SQL complejas
3. **Decorator**: Aplicar decorators a servicios existentes
4. **Facade**: Usar `UserFacade` para operaciones de usuario simplificadas
5. **Observer**: Usar `NotificationManager` para eventos del sistema
6. **Strategy**: Usar `AuthenticationManager` para diferentes tipos de autenticación

## 🔧 Configuración

Los patrones están diseñados para integrarse con la arquitectura existente:

-   **Base de datos**: Utilizan el pool de conexiones existente
-   **Autenticación**: Integrados con el sistema JWT actual
-   **Logging**: Compatible con el sistema de logging existente
-   **Servicios**: Extienden las clases de servicio actuales

## 📊 Beneficios de los Patrones

### Factory Method

-   ✅ Flexibilidad en la creación de objetos
-   ✅ Desacoplamiento del código cliente
-   ✅ Fácil extensión para nuevos tipos

### Builder

-   ✅ Construcción paso a paso
-   ✅ Código más legible
-   ✅ Reutilización de componentes

### Decorator

-   ✅ Funcionalidades adicionales sin modificar clases base
-   ✅ Composición flexible
-   ✅ Principio de responsabilidad única

### Facade

-   ✅ Interfaz simplificada para subsistemas complejos
-   ✅ Reducción de acoplamiento
-   ✅ Mejor mantenibilidad

### Observer

-   ✅ Comunicación desacoplada entre objetos
-   ✅ Extensibilidad fácil
-   ✅ Principio abierto/cerrado

### Strategy

-   ✅ Algoritmos intercambiables
-   ✅ Eliminación de condicionales complejas
-   ✅ Fácil testing y mantenimiento

## 🎯 Casos de Uso Prácticos

1. **Creación de usuarios**: Factory Method + Facade
2. **Consultas complejas**: Builder + Director
3. **Seguridad de servicios**: Decorator + Strategy
4. **Notificaciones**: Observer + Eventos
5. **Autenticación flexible**: Strategy + Context

## 📝 Notas de Implementación

-   Todos los patrones están documentados con JSDoc
-   Incluyen manejo de errores robusto
-   Son compatibles con TypeScript
-   Siguen las mejores prácticas de diseño
-   Incluyen ejemplos de uso completos

## 🔄 Extensibilidad

Los patrones están diseñados para ser fácilmente extensibles:

-   **Nuevos tipos de usuario**: Añadir factories al Factory Method
-   **Nuevas consultas**: Extender el Builder con nuevos métodos
-   **Nuevos decorators**: Implementar la interfaz `IService`
-   **Nuevas estrategias**: Implementar `IAuthenticationStrategy`
-   **Nuevos observadores**: Implementar `IObserver`

---

**Autor:** Emilio Rodríguez
**Fecha:** 17 de Enero, 2025
**Versión:** 1.0
