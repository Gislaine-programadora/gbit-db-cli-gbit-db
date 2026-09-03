import path from "path";

export default {

    database: path.join(process.cwd(), "data", "database.gbit"),

    backup: path.join(process.cwd(), "backups"),

    log: path.join(process.cwd(), "logs"),

    version: "1.0.0",

    engine: "GBIT DB"

}