import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";
import getReservations from "@/app/actions/getReservations";

interface IParams {
  listingId?: string;
}
// IMPORTANTISIMO: dado que esto es un server component tengo acceso a los params por la face,en cuanto lo marque como "use client" ya no podria hacer lo mismo.Fijate que es un objeto( supongo que es request.params.{}) y supongo que siempre va el último argumento porque usaron el operador rest, pero como no hay más aqui es el primero
const ListingPage = async ({ params }: { params: IParams }) => {
  const listing = await getListingById(params);
  const reservations = await getReservations(params);
  const currentUser = await getCurrentUser();

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingClient
        listing={listing}
        currentUser={currentUser} 
        reservations={reservations}
      />
    </ClientOnly>
  );
};

export default ListingPage;
