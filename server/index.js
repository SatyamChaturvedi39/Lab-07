import express from "express";
import cors from "cors";
import itemsRoutes from "./routes/itemsRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", itemsRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}/api`));