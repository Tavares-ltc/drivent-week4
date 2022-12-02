import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
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

const bookingService = {
  getBooking
};

export default bookingService;
