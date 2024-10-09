import express from 'express';

const app = express();
const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send("Hello prisma");
})

app.listen(port, () => {
  console.log(`prisma server running on port ${port}`)
})