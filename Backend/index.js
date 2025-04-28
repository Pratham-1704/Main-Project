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
app.use("/state",require("./Routes/statesRoute"));
app.use("/brand",require("./Routes/brandsRoute"));
app.use("/category",require("./Routes/categoryRoutes"));
app.use("/product",require("./Routes/productRoutes"));
app.use("/customer",require("./Routes/customerRoutes"));
app.use("/profession",require("./Routes/ProfessionRoutes"));
app.use("/financialyear",require("./Routes/financialYearRoutes"));
app.use("/firm",require("./Routes/firmRoutes"));
app.use("/source",require("./Routes/sourceRoutes"));
app.use("/order",require("./Routes/orderRoutes"));
app.use("/quotation",require("./Routes/quotationRoutes"));
app.use("/quotationdetail",require("./Routes/quotationDetailsRoutes"));
app.use("/quotationbrandprice",require("./Routes/quotationBrandPriceRoutes"));
app.use("/orderdetail",require("./Routes/orderDetailRoutes"));
app.use("/lead",require("./Routes/leadRoutes"));
app.use("/leaddetail",require("./Routes/leadDetailsRoutes"));
app.use("/parity",require("./Routes/ParityRoute"));
app.use("/brandproduct",require("./Routes/brandProductRoutes"));

app.listen(8081,()=>{
    console.log("server is running on port http://localhost:8081");
});