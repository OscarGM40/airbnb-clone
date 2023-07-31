import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import ClientOnly from "@/app/components/shared/ClientOnly";
import EmptyState from "@/app/components/shared/EmptyState";
import ListingClient from "./ListingClient";

interface IParams {
  listingId?: string;
}
// IMPORTANTISIMO: dado que esto es un server component tengo acceso a los params por la face,en cuanto lo marque como "use client" ya no podria hacer lo mismo.Fijate que es un objeto y que supongo que siempre va el último argumento,pero como no hay más aqui es el primero
const ListingPage = async ({ params }: { params: IParams }) => {
  const listing = await getListingById(params);
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
      <ListingClient listing={listing} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default ListingPage;
