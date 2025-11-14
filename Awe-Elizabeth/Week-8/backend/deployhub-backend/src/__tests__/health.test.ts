import request from 'supertest'
import app from '../app'

describe("do health check", () => {
    it("should get the health status", async() => {
        const res = await request(app).get("/api/healthCheck")
        .expect(200)
        expect(res.body.message).toBe("We are good to go")
    })
})