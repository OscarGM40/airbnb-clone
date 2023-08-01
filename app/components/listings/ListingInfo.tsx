"use client";
import { SafeUser } from "@/app/types";
import { Category } from "../navbar/Categories";
import useCountries from "@/app/hooks/useCountries";
import Avatar from "../shared/Avatar";
import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../shared/Map"),{ssr:false});

interface ListingInfoProps {
  user: SafeUser | null;
  description: string;
  category?: Category;
  roomCount: number;
  guestCount: number;
  bathroomCount: number;
  locationValue: string;
}
const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  category,
  roomCount,
  guestCount,
  bathroomCount,
  locationValue,
}) => {
  const { getByValue } = useCountries();
  const coordinates = getByValue(locationValue);

  return (
    <div className="col-span-4 flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold flex flex-row items-center gap-2">
          <div>Hosted by {user?.name}</div>
          <Avatar src={user?.image} />
        </div>
        <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
          <div>{guestCount} guests</div>
          <div>{roomCount} rooms</div>
          <div>{bathroomCount} bathrooms</div>
        </div>
      </div>
      <hr className="mt-2 mb-1" />
      {category && (
        <ListingCategory
          icon={category.icon}
          label={category.label}
          description={category.description}
        />
      )}
      <hr className="mt-2 mb-1" />
      <div className="text-lg font-light text-neutral-500">
        {description}
      </div>
      <hr className="mt-2 mb-3" />
      <Map center={coordinates?.latlng} />
    </div>
  );
};
export default ListingInfo;
