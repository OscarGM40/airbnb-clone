"use client";
import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import { Listing, Reservation } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import HeartButton from "../shared/HeartButton";

interface ListingCardProps {
  // son los putos tipos de la Entidad,wow
  data: Listing;
  reservation?: Reservation;
  onAction?: (id: string) => void;
  disabled: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
}
const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  const location = getByValue(data.locationValue);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // paramos la propagacion hacia arriba desde este child
      e.stopPropagation();
      if (disabled) return;

      onAction?.(actionId); // superpro no tengo que hacer onAction && onAction,idiota, me vale el operador ? tmb en funciones
    },
    [onAction, disabled, actionId],
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }
    return data.price;
  }, [data.price, reservation]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div
          className="
            aspect-square
            w-full
            relative
            overflow-hidden
            rounded-xl
        "
        >
          <Image
            alt="Listing"
            fill // fill le quita el error del width required
            src={data.imageSrc}
            className="object-cover h-full w-full group-hover:scale-110 transition duration-300"
          />
          <div className="absolute top-3 right-3">
            <HeartButton 
              listingId={data.id}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
