import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";
import ListingCard from "./components/listings/ListingCard";
import ClientOnly from "./components/shared/ClientOnly";
import Container from "./components/shared/Container";
import EmptyState from "./components/shared/EmptyState";

interface HomeProps {
  searchParams: IListingsParams;
}
// el nombre de este componente es irrelevante.Solo importa que el nombre del fichero es page.js y está dentro de app(luego es una ruta)
// fijate que como es un server componente voy a recibir los params,y que realmente los puedo llamar como quiera,searchParams o params,etc
// todo esto es para mandar la categoria claro
const Home = async ({ searchParams }: HomeProps) => {
  // compro que no necesitamos hacer una llamada a la API, para qué? si va a consultar a la db despues,ya hace lo mismo este getListings()
  const listings = await getListings(searchParams);
  // fijate que él ya ha echo que la llamada a getCurrentUser no lanze nunca ningun error,solo va a traer el currentUser a null en caso del mismo.Con esto se asegura que al llamarlo ahora nunca pete nada.Interesante también
  const currentUser = await getCurrentUser();

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      {/* es un simple centrador,gran idea de nuevo */}
      <Container>
        <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {listings.map((listing) => {
            return <ListingCard key={listing.id} currentUser={currentUser} data={listing} />;
          })}
        </div>
      </Container>
    </ClientOnly>
  );
};
export default Home;
