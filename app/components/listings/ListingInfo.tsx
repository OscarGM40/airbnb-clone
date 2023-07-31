"use client";
import { SafeUser } from "@/app/types";
import { Category } from "../navbar/Categories";

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
  return <div>ListingInfo</div>;
};
export default ListingInfo;
