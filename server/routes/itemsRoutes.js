import express from "express";
import { getItems, getItemById, getRoot } from "../controllers/itemsController";
const router = express.Router();

router.get("/", getRoot);
router.get("/items", getItems);
router.get("/items/:id", getItemById);

export default router;