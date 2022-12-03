import { conflictError, notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { exclude } from "@/utils/prisma-utils";

async function verifyTicketType(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
}

async function getBooking(userId: number) {
  await verifyTicketType(userId);
  const booking = await bookingRepository.getBookingByUserId(userId);
  if(!booking) throw notFoundError();
  return exclude(booking, "createdAt", "updatedAt", "userId", "roomId");
}
async function createBooking(userId: number, roomId: number) {
  await verifyTicketType(userId);
  const room = await hotelRepository.findRoomById(roomId);
  if(!room) throw notFoundError();

  const bookingList = await bookingRepository.findManyBookingsByRoomId(roomId);
  if(bookingList.length === room.capacity) throw conflictError("Room occupied");

  const userBooking = await bookingRepository.getBookingByUserId(userId);
  if(userBooking) throw conflictError("The user already has a booking");
  
  const booking = await bookingRepository.createBooking(userId, roomId);
  return { bookingId: booking.id };
}

async function updateBookingRoom(userId: number, roomId: number, bookingId: number) {
  const room = await hotelRepository.findRoomById(roomId);
  if(!room) throw notFoundError();

  const bookingList = await bookingRepository.findManyBookingsByRoomId(roomId);
  if(bookingList.length === room.capacity) throw conflictError("Room occupied");

  const booking = await bookingRepository.getBookingById(bookingId);
  if(!booking || booking.userId !== userId ) throw conflictError("The user is not the booking owner");

  await bookingRepository.updateBookingRoom(booking.id, roomId);
  return { bookingId };
}
const bookingService = {
  getBooking,
  createBooking,
  updateBookingRoom
};

export default bookingService;
