import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

export class ApplicationSetup {
    public app: express.Express;

    constructor() {}

    public Init() {
        this.app = express();
        this.BasicMiddlewareSetUp();
    }

     // basie middlewares (laufen bedingungslos)
     private BasicMiddlewareSetUp() {
        this.app.use(cors({
            origin: true,
            credentials: true
        }))
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(bodyParser.json());
    }
}