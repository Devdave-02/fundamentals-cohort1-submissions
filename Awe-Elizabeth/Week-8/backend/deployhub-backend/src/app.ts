import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express();

app.use(express.json())
app.use(cors())


const port = 5000
app.listen(5000, () => {
    console.log(`app currently running on port:${port}`)
});

app.get("/api/healthCheck", async(req: Request, res: Response) => {
    res.status(200).json({success: true, message: "We are good to go"})
})
export default app;