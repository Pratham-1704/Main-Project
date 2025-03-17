let express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect("mongodb://localhost:27017/adpro").then((res)=>{
    console.log("Database Connected...");
});

let app = express();
app.use(cors()); 
app.use(express.json());

app.get("/",(req, res)=>{
    res.send("Welcome to AdPro API");
});

app.use("/agencies",require("./routes/agenciesRoute"));

app.listen(8080,()=>{
    console.log("server is running on port http://localhost:8080");
});