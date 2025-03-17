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

app.use("/admin",require("./Routes/adminsRoute"));
app.use("/brand",require("./Routes/brandsRoute"));


const port =8081;
app.listen([port],()=>{
    console.log("server is running on port http://localhost: "+port );
});