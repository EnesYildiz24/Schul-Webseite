import express from "express";
import { GebietResource, ProfResource } from "../Resources";
import {
  createGebiet,
  deleteGebiet,
  getAlleGebiete,
  getGebiet,
  updateGebiet,
} from "../services/GebietService";
import { getAlleThemen } from "../services/ThemaService";
import { body, matchedData, param, validationResult } from "express-validator";
import {
  optionalAuthentication,
  requiresAuthentication,
} from "./authentication";

export const gebietRouter = express.Router();

gebietRouter.get("/alle", optionalAuthentication, async (_req, res, next) => {
  const gebiete = await getAlleGebiete();
  res.send(gebiete);
});

gebietRouter.get(
  "/:id",
  optionalAuthentication,
  param("id").isMongoId(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const gebietId = req.params!.id;
    try {
      const gebiet = await getGebiet(gebietId);
      if (!gebiet) {
        return res.status(404).json({
          errors: [
            { msg: "Gebiet nicht gefunden", path: "id", value: req.params!.id },
          ],
        });
      }
      if (!gebiet.public && req.profId !== gebiet.verwalter!) {
        return res.sendStatus(403);
      }

      res.status(200).send(gebiet);
    } catch (err) {
      res.sendStatus(404);
    }
  }
);

gebietRouter.get(
  "/:id/themen",
  optionalAuthentication,
  param("id").isMongoId(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const gebietId = req.params!.id;
    try {
      const themen = await getAlleThemen(gebietId);
      if (!themen || themen.length === 0) {
        res.status(404).json({
          errors: [
            {
              msg: "Keine Themen gefunden",
              path: "id",
              value: req.params!.id,
            },
          ],
        });
      }
      res.status(200).send(themen);
    } catch (err) {
      res.sendStatus(404);
    }
  }
);

gebietRouter.post(
  "/",
  requiresAuthentication,
  body("name").isString().isLength({ min: 1, max: 100 }),
  body("beschreibung").optional().isString().isLength({ min: 1, max: 1000 }),
  body("public").optional().isBoolean(),
  body("closed").optional().isBoolean(),
  body("verwalter").isMongoId(),
  body("verwalterName").optional().isString().isLength({ min: 1, max: 100 }),
  body("anzahlThemen").optional().isInt({ min: 0 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const gebietData = matchedData(req) as GebietResource;
    if (req.profId !== gebietData.verwalter) {
      return res.sendStatus(403);
    }
    try {
      const createdgebietResource = await createGebiet(gebietData);
      res.status(201).send(createdgebietResource);
    } catch (err) {
      next(err);
    }
  }
);

gebietRouter.put(
  "/:id",
  requiresAuthentication,
  param("id").isMongoId(),
  body("id").isMongoId(),
  body("name").isString().isLength({ min: 1, max: 100 }),
  body("beschreibung").isString().isLength({ min: 1, max: 1000 }),
  body("public").isBoolean(),
  body("closed").isBoolean(),
  body("verwalter").isMongoId(),
  body("verwalterName").isString().isLength({ min: 1, max: 100 }),
  body("anzahlThemen").optional().isInt({ min: 0 }),
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
      const gebietData = matchedData(req) as GebietResource;
      const updatedGebietResource = await updateGebiet(gebietData);
      if (!updatedGebietResource) {
        return res.status(404).json({
          errors: [
            {
              msg: "Gebiet nicht gefunden",
              path: "id",
              value: req.params!.id,
            },
          ],
        });
      }
      res.status(200).json(updatedGebietResource);
    } catch (err) {
      next({ status: 404 });
    }
  }
);

gebietRouter.delete(
  "/:id",
  requiresAuthentication,
  param("id").isMongoId(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const gebietID = await getGebiet(req.params!.id);
      if (req.profId !== gebietID.verwalter!) {
        return res.sendStatus(403);
      }
      await deleteGebiet(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      res.sendStatus(404); // vermutlich nicht gefunden, in nächsten Aufgabenblättern genauer behandeln
    }
  }
);
