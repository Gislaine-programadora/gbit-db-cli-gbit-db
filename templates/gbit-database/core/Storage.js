import fs from "fs";
import path from "path";

class Storage {

    constructor(directory) {

        this.directory = path.resolve(directory);

        // Cria o diretório do banco caso não exista
        fs.mkdirSync(this.directory, {
            recursive: true
        });

    }


    file(collection) {

        return path.join(
            this.directory,
            `${collection}.json`
        );

    }


    createCollection(name) {

        const file = this.file(name);

        // Garante que a pasta exista
        fs.mkdirSync(
            path.dirname(file),
            {
                recursive: true
            }
        );

        if (!fs.existsSync(file)) {

            fs.writeFileSync(
                file,
                JSON.stringify([], null, 2),
                "utf-8"
            );

        }

        return true;

    }


    save(collection, data) {

        const file = this.file(collection);

        // Garante que a pasta exista
        fs.mkdirSync(
            path.dirname(file),
            {
                recursive: true
            }
        );

        fs.writeFileSync(
            file,
            JSON.stringify(
                data,
                null,
                2
            ),
            "utf-8"
        );

        return data;

    }


    find(collection) {

        const file = this.file(collection);

        if (!fs.existsSync(file)) {

            return [];

        }

        return JSON.parse(
            fs.readFileSync(
                file,
                "utf-8"
            )
        );

    }

}

export default Storage;