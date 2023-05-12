declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NODE_ENV?: 'development' | 'production' | 'test';

    readonly PORT?: string;
    readonly PUBLIC_URL?: string;
    readonly TRUSTED_PROXIES?: string;
    readonly CORS_ALLOW_ORIGIN?: string;

    readonly APP_VERSION?: string;
    readonly APP_SECRET?: string;
    readonly APP_DEBUG?: string;

    // Database
    readonly DATABASE_URL?: string;
    readonly DATABASE_CONN_POOL_SIZE?: string;

    // Logging
    readonly MIKROORM_LOG_LEVEL?: string;
    readonly NEST_LOG_LEVEL?: string;
  }
}
