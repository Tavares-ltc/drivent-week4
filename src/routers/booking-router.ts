import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { createBooking, getBooking, updateBookingRoom } from "@/controllers/booking-controller";
const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", createBooking)
  .put("/:bookingId", updateBookingRoom);

export {
  bookingRouter
};
