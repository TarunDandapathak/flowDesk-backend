//start server
import app from "./src/app.js";
import connectDB from "./src/database/db.js";



const port = 8080;

app.get("/", (req, res) => {
    res.send(`test route`);
})

// database connect function called
connectDB();
//server the server
app.listen(port, () => {
    console.log(`server start on port ${port}`)
});