import express from "express";
import * as controller from "../controllers/itemsController.js";
const router = express.Router();

router.get("/", controller.getRoot);
router.get("/items", controller.getItems);
router.get("/items/:id", controller.getItemById);

export default router;