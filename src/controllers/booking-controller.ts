import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";
import { number } from "joi";

async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.name === "CannotListHotelsError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
  }
}

async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId: number = req.body.roomId;
  if(!roomId || typeof(roomId) !== "number" || roomId <= 0) return res.sendStatus(httpStatus.FORBIDDEN);
  
  try {
    const bookingId = await bookingService.createBooking(userId, roomId);
    return res.status(200).send(bookingId);  
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.name === "CannotListHotelsError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if (error.name === "ConflictError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}

async function updateBookingRoom(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const roomId = Number(req.body.roomId);
  if(!roomId || typeof(roomId) !== "number" || roomId <= 0) return res.sendStatus(httpStatus.FORBIDDEN);

  const bookingId = Number(req.params.bookingId);
  if(!bookingId || typeof(bookingId) !== "number" || bookingId <= 0) return res.sendStatus(httpStatus.FORBIDDEN);

  try {
    const updatedBookingId = await bookingService.updateBookingRoom(userId, roomId, bookingId);
    return res.status(200).send(updatedBookingId);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "ConflictError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}
export {
  getBooking,
  createBooking,
  updateBookingRoom
};
