class StatusController {


    index(req, res) {


        res.json({

            status: "online",

            database: "GBIT Database",

            version: "1.0.0",

            timestamp: new Date()

        });


    }


}


export default new StatusController();