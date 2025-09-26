/**
 * Patrón Builder para construir consultas SQL complejas
 * @module QueryBuilder
 * @author Emilio Rodríguez
 * @version 1.0
 * @description Builder para construir consultas SQL de manera fluida
 */

/**
 * Interfaz para definir el contrato del builder
 */
export interface IQueryBuilder {
    select(columns: string[]): IQueryBuilder;
    from(table: string): IQueryBuilder;
    where(condition: string): IQueryBuilder;
    and(condition: string): IQueryBuilder;
    or(condition: string): IQueryBuilder;
    orderBy(column: string, direction?: 'ASC' | 'DESC'): IQueryBuilder;
    limit(count: number): IQueryBuilder;
    build(): string;
}

/**
 * Clase concreta que implementa el QueryBuilder
 */
export class QueryBuilder implements IQueryBuilder {
    private query: string = '';
    private selectColumns: string[] = [];
    private fromTable: string = '';
    private whereConditions: string[] = [];
    private orderByClause: string = '';
    private limitClause: string = '';

    /**
     * Especifica las columnas a seleccionar
     * @param columns Array de nombres de columnas
     * @returns Instancia del builder para encadenamiento
     */
    public select(columns: string[]): IQueryBuilder {
        this.selectColumns = columns;
        return this;
    }

    /**
     * Especifica la tabla principal
     * @param table Nombre de la tabla
     * @returns Instancia del builder para encadenamiento
     */
    public from(table: string): IQueryBuilder {
        this.fromTable = table;
        return this;
    }

    /**
     * Añade una condición WHERE
     * @param condition Condición SQL
     * @returns Instancia del builder para encadenamiento
     */
    public where(condition: string): IQueryBuilder {
        this.whereConditions.push(condition);
        return this;
    }

    /**
     * Añade una condición AND
     * @param condition Condición SQL
     * @returns Instancia del builder para encadenamiento
     */
    public and(condition: string): IQueryBuilder {
        this.whereConditions.push(`AND ${condition}`);
        return this;
    }

    /**
     * Añade una condición OR
     * @param condition Condición SQL
     * @returns Instancia del builder para encadenamiento
     */
    public or(condition: string): IQueryBuilder {
        this.whereConditions.push(`OR ${condition}`);
        return this;
    }

    /**
     * Especifica el ordenamiento
     * @param column Columna para ordenar
     * @param direction Dirección del ordenamiento
     * @returns Instancia del builder para encadenamiento
     */
    public orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): IQueryBuilder {
        this.orderByClause = `ORDER BY ${column} ${direction}`;
        return this;
    }

    /**
     * Especifica el límite de resultados
     * @param count Número máximo de resultados
     * @returns Instancia del builder para encadenamiento
     */
    public limit(count: number): IQueryBuilder {
        this.limitClause = `LIMIT ${count}`;
        return this;
    }

    /**
     * Construye la consulta SQL final
     * @returns Consulta SQL construida
     */
    public build(): string {
        if (this.selectColumns.length === 0) {
            throw new Error('Debe especificar al menos una columna para SELECT');
        }
        if (!this.fromTable) {
            throw new Error('Debe especificar una tabla para FROM');
        }

        this.query = `SELECT ${this.selectColumns.join(', ')} FROM ${this.fromTable}`;

        if (this.whereConditions.length > 0) {
            this.query += ` WHERE ${this.whereConditions.join(' ')}`;
        }

        if (this.orderByClause) {
            this.query += ` ${this.orderByClause}`;
        }

        if (this.limitClause) {
            this.query += ` ${this.limitClause}`;
        }

        return this.query;
    }
}

/**
 * Director para el QueryBuilder que proporciona métodos de conveniencia
 */
export class QueryDirector {
    private builder: IQueryBuilder;

    constructor(builder: IQueryBuilder) {
        this.builder = builder;
    }

    /**
     * Construye una consulta para obtener todos los estudiantes
     * @returns Consulta SQL para estudiantes
     */
    public buildEstudiantesQuery(): string {
        return this.builder
            .select(['id', 'nombre', 'email', 'fecha_nacimiento'])
            .from('estudiantes')
            .where('estado = 1')
            .orderBy('nombre', 'ASC')
            .build();
    }

    /**
     * Construye una consulta para obtener profesores activos
     * @returns Consulta SQL para profesores
     */
    public buildProfesoresQuery(): string {
        return this.builder
            .select(['id', 'nombre', 'email', 'especialidad'])
            .from('profesores')
            .where('estado = 1')
            .orderBy('nombre', 'ASC')
            .build();
    }

    /**
     * Construye una consulta para buscar usuarios por nombre
     * @param nombre Nombre a buscar
     * @returns Consulta SQL de búsqueda
     */
    public buildBusquedaUsuariosQuery(nombre: string): string {
        return this.builder
            .select(['id', 'nombre', 'email', 'tipo'])
            .from('usuarios')
            .where(`nombre LIKE '%${nombre}%'`)
            .and('estado = 1')
            .orderBy('nombre', 'ASC')
            .limit(50)
            .build();
    }
}

export default QueryBuilder;
