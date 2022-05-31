export interface DBConfig {
    /** connection name */
    name: string;
    /** db type */
    type: string;
    host: string;
    port: string;
    username: string;
    password: string;
    database: string;
    charset: string;
    useUTC: boolean;
    synchronize: boolean;
    logging: boolean;
    /** models path string array */
    entities: string[];
}

declare module 'egg' {
    interface EggAppConfig {
        esConfig?: {
            host: string | string[];
        };

        mysql?: {
            clients: DBConfig[];
        };
    }
}
