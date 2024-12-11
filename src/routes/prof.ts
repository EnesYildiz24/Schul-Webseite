import express from "express";
import { ProfResource } from "../Resources";
import {
  createProf,
  deleteProf,
  getAlleProfs,
  updateProf,
} from "../services/ProfService";
import { body, matchedData, param, validationResult } from "express-validator";

export const profRouter = express.Router();

profRouter.get("/alle", async (_req, res) => {
  const profs = await getAlleProfs();
  res.send(profs); // Default Status 200
});

profRouter.post(
  "/",
  body("name").isString().isLength({ min: 1, max: 100 }),
  body("titel").optional().isString().isLength({ min: 1, max: 100 }),
  body("campusID").isString().isLength({ min: 1 }),
  body("password").isStrongPassword().isLength({ min: 5 }),
  body("admin").isBoolean(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const profData = matchedData(req) as ProfResource;
      const createdProfResource = await createProf(profData);
      res.status(201).send(createdProfResource);
    } catch (err) {
      next(err as Error);
    }
  }
);

profRouter.put(
  "/:id",
  param("id").isMongoId(),
  body("id").isMongoId(),
  body("name").isString().isLength({ min: 1, max: 100 }),
  body("titel").isString().isLength({ min: 1, max: 100 }),
  body("campusID").isString().isLength({ min: 1 }),
  body("password").optional().isStrongPassword(),
  body("admin").isBoolean(),
  async (req, res, next) => {
    const errors = validationResult(req).array();
    if (req.params?.id !== req.body.id) {
      return res.status(400).json({
        errors: [
          {
            type: "field",
            location: "params",
            msg: "Invalid value",
            path: "id",
            value: req.params!.id,
          },
          {
            type: "field",
            location: "body",
            msg: "Invalid value",
            path: "id",
            value: req.body.id,
          },
        ],
      });
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }
    try {
      const profData = matchedData(req) as ProfResource;
      const updatedProfResource = await updateProf(profData);
      if (!updatedProfResource) {
        return res.status(404).json({
          errors: [
            {
              msg: "Prof nicht gefunden",
              path: "id",
              value: req.params!.id,
            },
          ],
        });
      }
      res.status(200).json(updatedProfResource);
    } catch (err) {
      next({ status: 404 });
    }
  }
);

profRouter.delete("/:id", param("id").isMongoId(), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const profId = req.params!.id;
    const profExists = (await getAlleProfs()).find(
      (prof) => prof.id === profId
    );
    if (!profExists) {
      return res.sendStatus(404);
    }
    await deleteProf(profId);
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(404); // vermutlich nicht gefunden, in nächsten Aufgabenblättern genauer behandeln
  }
});
