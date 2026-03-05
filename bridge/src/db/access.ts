import * as odbc from "odbc";           // Namespace import = more reliable TS typings
import type { Connection } from "odbc"; // Type-only import (no runtime output)

/** Build MS Access ODBC connection string from .env **/
function getConnectionString(): string {
    const driver = process.env.ODBC_DRIVER;
    const dbPath = process.env.ACCDB_PATH;

    // Fail fast if env vars are missing
    if (!driver) throw new Error("ODBC_DRIVER is missing in .env");
    if (!dbPath) throw new Error("ACCDB_PATH is missing in .env");

    // Access ODBC expects: Driver={...};Dbq=full_path_to_accdb;
    return `Driver={${driver}};Dbq=${dbPath};`;
}

/**Runs a DB callback with an open ODBC connection, then closes it.**/
export async function withDb<T>(fn: (conn: Connection) => Promise<T>): Promise<T> {
    const connStr = getConnectionString();

    try {
        const conn = await odbc.connect(connStr); // open connection
        try {
            return await fn(conn);                  // run caller's DB work
        } finally {
            await conn.close();                     // always close / release lock
        }
    } catch (error: any) {
        // Helpful logging for debugging ODBC failures
        console.error("--- ODBC CONNECTION ERROR ---");
        console.error("Message:", error.message);
        if (error.odbcErrors) {
            console.error("Details:", JSON.stringify(error.odbcErrors, null, 2));
        }
        console.error("-----------------------------");
        throw error; // rethrow so API/controller can handle it
    }
}

/** Quick health check: if this query works, DB connection is OK */
export async function testDbConnection(): Promise<boolean> {
    return withDb(async (conn) => {
        await conn.query("SELECT TOP 1 id FROM NewJoiners");
        return true;
    });
}