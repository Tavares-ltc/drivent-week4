import { prisma } from "@/config";

async function getBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    include: { Room: true }
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    },
  });
}

async function findManyBookingsByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: { roomId }
  });
}

async function getBookingById(bookingId: number) {
  return prisma.booking.findFirst({
    where: { id: bookingId }
  });
}

async function updateBookingRoom(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      roomId
    }
  });
}

const bookingRepository = {
  getBookingByUserId,
  createBooking,
  findManyBookingsByRoomId,
  getBookingById,
  updateBookingRoom
};

export default bookingRepository;
