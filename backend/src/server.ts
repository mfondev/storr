import express, { type Request, type Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World")
});

const PORT = 3000

app.listen(PORT,()=>{
    console.log("Successful");
})


