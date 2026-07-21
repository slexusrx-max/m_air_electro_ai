import "server-only";

export type DatabaseDialect = "postgres" | "mysql" | "sqlite" | "unknown";

export interface DatabaseAdapter {
  dialect: DatabaseDialect;
  transaction<T>(callback: (db: DatabaseAdapter) => Promise<T>): Promise<T>;
}

export interface Repository<TRecord> {
  findById(id: string): Promise<TRecord | null>;
}

function getDialectFromUrl(url?: string): DatabaseDialect {
  if (!url) {
    return "unknown";
  }

  if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
    return "postgres";
  }

  if (url.startsWith("mysql://")) {
    return "mysql";
  }

  if (url.startsWith("file:") || url.endsWith(".sqlite") || url.endsWith(".db")) {
    return "sqlite";
  }

  return "unknown";
}

export function getDatabaseRuntimeStatus() {
  const url = process.env.DATABASE_URL?.trim();
  return {
    configured: Boolean(url),
    dialect: getDialectFromUrl(url),
    connectionStringPresent: Boolean(url),
  };
}
