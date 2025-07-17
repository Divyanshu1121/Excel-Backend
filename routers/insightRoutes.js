const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const authMiddleware = require("../middlewares/authMiddleware");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post("/insight", authMiddleware, async (req, res) => {
    try {
        const { data } = req.body;

        if (!data || data.length === 0) {
            return res.status(400).json({ msg: "No data provided" });
        }

        const summary = `This mock insight describes uploaded Excel data. 
        The file contains structured tabular data, where you can observe patterns such as higher sales in specific months, outliers in pricing, or clustering of categories. 
        This helps users visualize trends and prepare reports. More advanced insights would reveal averages, correlations, and anomalies based on larger datasets. 
        Make sure to replace this with actual OpenAI response in production.`;

        res.json({ summary });
    } catch (error) {
        console.error("Insight generation failed:", error);
        res.status(500).json({ msg: "Insight generation failed" });
    }
});


module.exports = router;
