import express from "express"

const Port = 3000;
const app = express();


app.listen(Port, () => {
    console.clear();
    console.log(`Server Listening in http://localhost:${Port}`);
})

app.get('/', (req, res) => {
    return res.status(200).send("Hello world");
})