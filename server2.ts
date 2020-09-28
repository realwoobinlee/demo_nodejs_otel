const ServiceName = "Service 2";
//-------------------------------------------------------------------
//OpenTelemetry Config
//-------------------------------------------------------------------
import {SimpleSpanProcessor, ConsoleSpanExporter} from "@opentelemetry/tracing";
import { NodeTracerProvider } from "@opentelemetry/node";
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";
import { LogLevel, ConsoleLogger } from "@opentelemetry/core";

const provider = new NodeTracerProvider({
    logLevel: LogLevel.INFO
});
/*
const consoleExporter = new ConsoleSpanExporter();
const spanProcessor = new SimpleSpanProcessor(consoleExporter);
provider.addSpanProcessor(spanProcessor);
*/

const exporterOptions = {
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
import { request } from "http";
import Axios from "axios";

const PORT = "8081";

let Server: ApplicationSetup = new ApplicationSetup();
Server.Init();

Server.app.get("/product", async (req: express.Request,res: express.Response) => {
    const context = opentelemetry.trace.getTracer('logform').getCurrentSpan().context();
    console.log(
        `TraceId: ${context.traceId}\nSpanId: ${context.spanId}\nlog: this is the log text`
    );
    res.status(200).json({"text": "it has been successful"});
});

Server.app.get("/user", async (req: express.Request,res: express.Response) => {
    const context = opentelemetry.trace.getTracer('logform').getCurrentSpan().context();
    console.log(
        `TraceId: ${context.traceId}\nSpanId: ${context.spanId}\nlog: this is the log text`
    );
    res.status(403).json({"text": "error"});
});

Server.app.listen(PORT, () => {
    console.log(`Service 2 running at ${PORT}`)
});