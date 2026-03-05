import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import { healthRouter } from "./routes/health.routes";
import { newJoinersRouter } from "./routes/newJoiners.routes";

const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

const app = express();
const port = Number(process.env.BRIDGE_PORT || 5179);
const host = "127.0.0.1";
const baseUrl = `http://${host}:${port}`;

// Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "New Joiner Management API",
            version: "1.0.0",
            description: "Local Bridge API connecting React to a Microsoft Access DB on OneDrive",
        },
        servers: [{ url: baseUrl, description: "Local Dev" }],
    },
    apis: [path.join(__dirname, "routes/*.routes.ts")],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Simple request log
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// CORS + body parsers (must be before routes)
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            `http://localhost:${port}`,
            `http://127.0.0.1:${port}`,
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/health", healthRouter);
app.use("/api/new-joiners", newJoinersRouter);

// Global error handler (keep this last)
app.use((err: any, _req: any, res: any, _next: any) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ status: "error", message: err?.message || "Server error" });
});

app.listen(port, () => {
    console.log(`🚀 Bridge running on ${baseUrl}`);
    console.log(`📖 Documentation: ${baseUrl}/api-docs`);
});