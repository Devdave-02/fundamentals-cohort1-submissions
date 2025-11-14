
import express from "express";
import request from "supertest";
import promClient from "prom-client";

const app = express();

app.get("/health-check", (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.send(await promClient.register.metrics());
});

describe("Server endpoints", () => {
  describe("GET /health-check", () => {
    it("should return 200 with health status", async () => {
      const response = await request(app).get("/health-check");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "ok");
      expect(response.body).toHaveProperty("uptime");
      expect(response.body).toHaveProperty("version");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  describe("GET /metrics", () => {
    it("should return 200 with prometheus metrics", async () => {
      const response = await request(app).get("/metrics");
      expect(response.status).toBe(200);
      expect(response.header['content-type']).toEqual('text/plain; version=0.0.4; charset=utf-8');
    });
  });
});
