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

<<<<<<< HEAD

const port =8081;
app.listen([port],()=>{
    console.log("server is running on port http://localhost: "+port );
=======
app.listen(8081,()=>{
    console.log("server is running on port http://localhost:8081");
>>>>>>> 4307f3442e1698577ca5f5ad96b6ff59ac5f518c
});