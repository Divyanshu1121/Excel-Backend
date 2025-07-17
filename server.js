const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config();
console.log("OPENAI_API_KEY loaded:", process.env.OPENAI_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routers/authRoutes"));
app.use("/api/upload", require("./routers/uploadRoutes"));
app.use("/api/users", require("./routers/userRoutes"));
app.use("/api", require("./routers/insightRoutes"));
app.use("/api/admin", require("./routers/adminRoutes"));

connectDB().then(() => {
    app.listen(process.env.PORT, () =>
        console.log(`Server running on port ${process.env.PORT}`)
    );
});
