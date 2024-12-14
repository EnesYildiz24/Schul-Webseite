import express from "express";
import { ThemaResource } from "../Resources";
import {
  createThema,
  deleteThema,
  getAlleThemen,
  getThema,
  updateThema,
} from "../services/ThemaService";
import { body, matchedData, param, validationResult } from "express-validator";
import {
  optionalAuthentication,
  requiresAuthentication,
} from "./authentication";

export const themenRouter = express.Router();

themenRouter.get(
  "/:id",
  optionalAuthentication,
  param("id").isMongoId(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const themenId = req.params!.id;
      const thema = await getThema(themenId);
      return res.status(200).send(thema);
    } catch (err) {
      next(404);
    }
  }
);

themenRouter.post(
  "/",
  requiresAuthentication,
  body("titel").isString().isLength({ min: 1, max: 100 }),
  body("beschreibung").isString().isLength({ min: 1, max: 1000 }),
  body("abschluss").optional().isString().isLength({ min: 1, max: 100 }),
  body("status").optional().isString().isLength({ min: 1, max: 100 }),
  body("betreuer").isMongoId(),
  body("betreuerName").optional().isString().isLength({ min: 1, max: 100 }),
  body("gebiet").isString().isLength({ min: 1, max: 100 }),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const themaResource = matchedData(req) as ThemaResource;
      const createdthemaResource = await createThema(themaResource);
      return res.status(201).send(createdthemaResource);
    } catch (err) {
      next({ status: 404 });
    }
  }
);

themenRouter.put(
  "/:id",
  requiresAuthentication,
  param("id").isMongoId(),
  body("id").isMongoId(),
  body("titel").isString().isLength({ min: 1, max: 100 }),
  body("beschreibung").isString().isLength({ min: 1, max: 1000 }),
  body("abschluss").isString().isLength({ min: 1, max: 100 }),
  body("status").isString().isLength({ min: 1, max: 100 }),
  body("betreuer").isMongoId(),
  body("betreuerName").isString().isLength({ min: 1, max: 100 }),
  body("gebiet").isMongoId(),
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
      const themaResource = matchedData(req) as ThemaResource;
      const updatedThemaResource = await updateThema(themaResource);
      if (!updatedThemaResource) {
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
      res.status(200).send(updatedThemaResource);
    } catch (err) {
      next({ status: 404 });
    }
  }
);

themenRouter.delete(
  "/:id",
  requiresAuthentication,
  param("id").isMongoId(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const themaID = req.params!.id;
      await deleteThema(themaID);
      res.sendStatus(204);
    } catch (err) {
      res.sendStatus(404); // vermutlich nicht gefunden, in nächsten Aufgabenblättern genauer behandeln
    }
  }
);
