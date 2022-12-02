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

const bookingRepository = {
  getBookingByUserId,
  createBooking
};

export default bookingRepository;
