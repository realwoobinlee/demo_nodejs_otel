
//OpenTelemetry Config
import { CollectorExporterConfigBase } from "@opentelemetry/exporter-collector/build/src/types";
import {BasicTracerProvider, SimpleSpanProcessor, ConsoleSpanExporter} from "@opentelemetry/tracing";
import {CollectorTraceExporter} from "@opentelemetry/exporter-collector-grpc";
import { NodeTracerProvider } from "@opentelemetry/node";
//import { WebTracerProvider } from "@opentelemetry/web";

const provider = new NodeTracerProvider(/*{
    plugins: {
        grpc: {
            enabled: true,
            path: "@opentelemetry/plugin-grpc",
        }
    }
}*/);
/*
const consoleExporter = new ConsoleSpanExporter();
const spanProcessor = new SimpleSpanProcessor(consoleExporter);
provider.addSpanProcessor(spanProcessor);
*/

const collectorOptions: CollectorExporterConfigNode = {
    url: "https://15fe8caf1108.ngrok.io",
    serviceName: "Service 1",
    headers:{}
}
const collectorExporter = new CollectorTraceExporter(collectorOptions);


provider.addSpanProcessor(new SimpleSpanProcessor(collectorExporter));
provider.register();

// Application Server
import { ApplicationSetup } from "./config";
import express from "express";
import { CollectorExporterConfigNode } from "@opentelemetry/exporter-collector-grpc/build/src/types";

const PORT = "8080";

let Server: ApplicationSetup = new ApplicationSetup();
Server.Init();

Server.app.get("/user", (req: express.Request,res: express.Response) => {
    console.log("hallo")
    res.json({"res": "hello world"})
})

Server.app.listen(PORT, () => {
    console.log(`Service 1 running at ${PORT}`)
});


