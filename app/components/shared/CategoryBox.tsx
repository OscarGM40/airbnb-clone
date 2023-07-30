"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";
import qs from "query-string";

interface CategoryBoxProps {
  icon: IconType;
  label: string;
  description?: string;
  selected?: boolean;
}
const CategoryBox = ({ icon: Icon, label, selected }: CategoryBoxProps) => {
  const router = useRouter(); // recuerda que en la 12 venia de next/router pero desde la 13 es desde next/navigation
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    // dado que vamos a parsear a objeto declaro uno primero
    let currentQuery = {};
    // si hay params me los parseo a un objeto
    if (params) {
      currentQuery = qs.parse(params.toString());
    }
    // y le agrego la nueva propiedad,es decir, cada vez que hagan click agregarán la label a la query(pues estoy en el handleClick,asinto)
    const updatedQuery: any = {
      ...currentQuery,
      category: label,
    };
    // pero si ya estaba en la query no la borramos/posteamos/añadimos
    if (params?.get("category") === label) {
      delete updatedQuery.category;
    }
    // volvemos a crear la url y filtrando los nulls
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true,strict:true,skipEmptyString:true },
    );
    router.push(url);
  }, [params, label, router]);

  return (
    <div
      onClick={handleClick}
      className={`
        flex 
        flex-col
        items-center
        justify-center 
        gap-2
        p-3
        border-b-2
      hover:text-neutral-800
        transition 
        cursor-pointer
      ${selected ? "border-b-neutral-800" : "border-transparent"}
      ${selected ? "text-neutral-800" : "text-neutral-500"}
      `}
    >
      <Icon size={26} />
      <div className="font-medium text-sm">{label}</div>
    </div>
  );
};

export default CategoryBox;
