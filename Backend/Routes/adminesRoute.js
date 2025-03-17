
let express=require('express');
const router=express.Router();

const Admin=require("../Models/AdminSchema");
router.get("/", async (req, res) => {
    try {

        let alladmines = await admines.find({});

        res.json({ status: "success", data: alladmines })
    } catch (err) {
        res.json({ status: "error", data: "Something Wents Wrong !!!" });
    }
});

router.get("/:id", async (req, res) => {

    try {
        const aadminesId= req.params.id;

        let singleadmines = await admines.findById(adminesId);

        res.json({ status: "success", data: singleadmines })
    } catch (err) {
        res.json({ status: "error", data: "Something Wents Wrong !!!" });
    }
});

router.post("/", async (req, res) => {

    try {

        const data = req.body;

        let addadmines= awaitadmines.create(data);
        res.json({ status: "success", data: addadmines });

    } catch (err) {
        res.json({ status: "error", data: "Something Wents Wrong !!!" });
    }
});

router.put("/:id", async (req, res) => {

    try {

        const adminesId= req.params.id;
        const data = req.body;

        let updatedadmines = await Agency.findByIdAndUpdate(adminesId, data, { new: true })

        res.send({ status: "success", data: updatedadmines });
    } catch (err) {
        res.send({ status: "error", data: "Something Wents Wrong !!!" });
    }
});

router.delete("/:id", async (req, res) => {

    try {

        const adminesId= req.params.id;

        let deletedadmines= await admines.findByIdAndDelete(adminesId)

        res.send({ status: "success", data: deletedadmines });
    } catch (err) {
        res.send({ status: "error", data: "Something Wents Wrong !!!" });
    }
});

module.exports=router;
