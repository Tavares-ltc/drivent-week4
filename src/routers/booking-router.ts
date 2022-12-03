import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { createBooking, getBooking } from "@/controllers/booking-controller";
const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", createBooking);

export {
  bookingRouter
};
