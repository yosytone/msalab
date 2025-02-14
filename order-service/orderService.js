const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const Order = require("./models/Order");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://mongo:27017/orders", { useNewUrlParser: true, useUnifiedTopology: true });

app.post("/orders", async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/orders/:id", async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    try {
        const user = await axios.get(`http://user-service:3001/users/${order.userId}`);
        res.json({ order, user: user.data });
    } catch (error) {
        res.json({ order, user: "User not found" });
    }
});

app.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3002, () => console.log("✅ Order Service running on port 3002"));
