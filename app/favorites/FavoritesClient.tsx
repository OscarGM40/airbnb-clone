"user client";
import Container from "../components/shared/Container";
import Heading from "../components/shared/Heading";
import { SafeListing, SafeUser } from "../types";

interface FavoritesClientProps {
  listings: SafeListing[];
  currentUser: SafeUser | null;
}
const FavoritesClient: React.FC<FavoritesClientProps> = ({ 
  listings,
  currentUser }) => {
  return <Container>
    <Heading 
      title="Favorites"
      subtitle="List of places you have favorited!"
    />
  </Container>;
};
export default FavoritesClient;
