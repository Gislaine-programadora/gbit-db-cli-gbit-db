import fs from "fs";
import path from "path";
import config from "../config/config.js";
import { banner } from "../../gbit-container/runtime/banner.js";

banner();

console.log("🔎 Running GBIT DB Doctor...\n");

const checks = [
    {
        name: "Database File",
        check: () => fs.existsSync(config.database)
    },
    {
        name: "Models Folder",
        check: () => fs.existsSync(path.join(process.cwd(), "models"))
    },
    {
        name: "Controllers Folder",
        check: () => fs.existsSync(path.join(process.cwd(), "controllers"))
    },
    {
        name: "Routes Folder",
        check: () => fs.existsSync(path.join(process.cwd(), "routes"))
    },
    {
        name: "Services Folder",
        check: () => fs.existsSync(path.join(process.cwd(), "services"))
    },
    {
        name: "Uploads Folder",
        check: () => fs.existsSync(path.join(process.cwd(), "uploads"))
    },
    {
        name: "Logs Folder",
        check: () => fs.existsSync(path.join(process.cwd(), "logs"))
    }
];

let success = 0;

for (const item of checks) {

    if (item.check()) {

        console.log(`✅ ${item.name}`);

        success++;

    } else {

        console.log(`❌ ${item.name}`);

    }

}

console.log("\n══════════════════════════════════════");

console.log(`Checks Passed : ${success}/${checks.length}`);

if (success === checks.length) {

    console.log("🎉 GBIT DB is ready!");

} else {

    console.log("⚠️ Some components are missing.");

}

console.log("══════════════════════════════════════\n");