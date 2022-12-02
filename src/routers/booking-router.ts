import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBooking } from "@/controllers/booking-controller";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBooking);

export {
  bookingRouter
};
