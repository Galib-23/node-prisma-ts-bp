import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = process.env.PORT || 3000;


app.get('/', (req: Request, res: Response) => {
  res.send("Hello prisma");
})

app.listen(port, () => {
  console.log(`prisma server running on port ${port}`)
})