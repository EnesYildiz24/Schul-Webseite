import express from "express";
import "express-async-errors"; // needs to be imported before routers and other stuff!
import { themenRouter } from "./routes/thema";
import { gebietRouter } from "./routes/gebiet";
import { profRouter } from "./routes/prof";

const app = express();

// Middleware:

// Wozu wird diese Middleware benötigt?
app.use(express.json());

/*
Die Middleware wird benötigt, um eine eingehende HTTPS Anfrage zu parsen,
die in der JSON Daten im Body enthalten sind. 
die anfrage wird dann automatisch in eine JavaScript Objekt umgewandelt sodass man damit arbeiten kann.
*/

// Routes
// Registrieren Sie hier die Router!
app.use("/api/thema", themenRouter);
app.use("/api/gebiet", gebietRouter);
app.use("/api/prof", profRouter);

export default app;
