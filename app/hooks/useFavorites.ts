import axios from "axios";

import useLoginModal from "./useLoginModal";
import { SafeUser } from "../types";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

interface IUseFavorite {
  listingId: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];
    return list.includes(listingId);
  }, [currentUser?.favoriteIds, listingId]);

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      // fijate que si la imagen padre contenedora tuviera algun evento es necesario parar la propagacion hacia arriba del hijo
      e.stopPropagation();
      // si no hubiera usuario y queremos dar like abrimos la modal para que se logueen
      if (!currentUser) {
        return loginModal.onOpen();
      }

      try {
        let request;
        // fijate que approach tan interesante
        if (hasFavorited) {
          request = () => axios.delete(`/api/favorites/${listingId}`);
        } else {
          request = () => axios.post(`/api/favorites/${listingId}`);
        }
        await request();
        router.refresh();
        toast.success(`Success`);
      } catch (error) {
        toast.error(`Something went wrong.`);
      }
    },
    [currentUser, loginModal, listingId, hasFavorited, router],
  );

  return {
    hasFavorited,
    toggleFavorite
  }
};

export default useFavorite;