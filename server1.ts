const ServiceName = "Service 1";
//-------------------------------------------------------------------
//OpenTelemetry Config
//-------------------------------------------------------------------
import {SimpleSpanProcessor, ConsoleSpanExporter} from "@opentelemetry/tracing";
import { NodeTracerProvider } from "@opentelemetry/node";
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";
import { LogLevel, ConsoleLogger } from "@opentelemetry/core";
import dotenv from "dotenv";
dotenv.config();

const provider = new NodeTracerProvider({
    logLevel: LogLevel.INFO
});
/*
const consoleExporter = new ConsoleSpanExporter();
const spanProcessor = new SimpleSpanProcessor(consoleExporter);
provider.addSpanProcessor(spanProcessor);
*/

const exporterOptions: ExporterConfig = {
    url: process.env.ZIPKIN_URL,
    serviceName: ServiceName,
    headers:{}
}
const zipkinExporter = new ZipkinExporter(exporterOptions);
provider.addSpanProcessor(new SimpleSpanProcessor(zipkinExporter));

provider.register();

//-------------------------------------------------------------------
// Application Server
//-------------------------------------------------------------------
import { ApplicationSetup } from "./config";
import express from "express";
import opentelemetry from "@opentelemetry/api";
import axios from "axios";
import { ExporterConfig } from "@opentelemetry/exporter-zipkin/build/src/types";

const PORT = "8080";

let Server: ApplicationSetup = new ApplicationSetup();
Server.Init();

Server.app.get("/success", async (req: express.Request,res: express.Response) => {

    let httpres = await axios.get("http://localhost:8081/product");

    const context = opentelemetry.trace.getTracer('logform').getCurrentSpan().context();
    console.log(
        `TraceId: ${context.traceId}\nSpanId: ${context.spanId}\nlog: this is the log text`
    );
    
    res.json({"status": httpres.status,"res": httpres.data});
})

Server.app.get("/failure", async (req: express.Request,res: express.Response) => {
    try{
        let httpres = await axios.get("http://localhost:8081/user");
        const context = opentelemetry.trace.getTracer('logform').getCurrentSpan().context();
        console.log(
            `TraceId: ${context.traceId}\nSpanId: ${context.spanId}\nlog: this is the log text`
        );
        
        res.json({"status": httpres.status,"res": httpres.data});
    }catch(error) {
        res.status(403).json({"error": error});
    }
    
})


Server.app.listen(PORT, () => {
    console.log(`Service 1 running at ${PORT}`)
});


