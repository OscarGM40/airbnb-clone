import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  reservationId?: string;
}
export async function DELETE(
  request: Request,
  // entiendo que desectructuramos porque es req.params ??
  { params }: { params: IParams },
) {
  console.log({ request });
  // fijate que es llamada a proceso asincrono dentro de una funcion
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }
  const { reservationId } = params;
  if (!reservationId || typeof reservationId !== "string") {
    throw new Error("Invalid ID");
  }
  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      // o bien es el creador de la reserva o el creador de la listing en la que esta la reserva(el dueño de la casa o el que reservó)
      OR: [{ userId: currentUser.id }, { listing: { userId: currentUser.id } }],
    },
  });
  return NextResponse.json(reservation);
}
