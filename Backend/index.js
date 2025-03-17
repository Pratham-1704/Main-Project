let express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect("mongodb://localhost:27017/main-project").then((res)=>{
    console.log("Database Connected...");
});

let app = express();
app.use(cors()); 
app.use(express.json());

app.get("/",(req, res)=>{
    res.send("Welcome to API");
});

app.use("/admin",require("./routes/adminsRoute"));

app.listen(8081,()=>{
    console.log("server is running on port http://localhost:8081");
});