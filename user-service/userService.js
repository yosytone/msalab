const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://mongo:27017/users", { useNewUrlParser: true, useUnifiedTopology: true });

app.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/users/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) res.json(user);
    else res.status(404).json({ error: "User not found" });
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => console.log("✅ User Service running on port 3001"));
