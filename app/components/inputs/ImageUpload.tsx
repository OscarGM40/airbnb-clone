"use client";

// el widget es el dragg and drop
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
  var cloudinary: any;
}

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string; //la url
}
const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const handleUpload = useCallback(
    (result: any) => {
      onChange(result.info.secure_url);
    },
    [onChange],
  );
  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset="airbnb-clone"
      options={{
        maxFiles: 1,
      }}
    >
      {/* el open sabe que puede desestructurarlo del Cmp.Fijate que siempre que puedo hacer esto es porque estoy en un HOC de una libreria y sé a que tengo acceso */}
      {({ open }) => {
        return (
          <div
            className="
              relative 
              cursor-pointer
              hover:opacity-70
              transition
              border-dashed
              border-2
              p-20 
              border-neutral-300
              flex
              flex-col
              justify-center
              items-center
              gap-4
              text-neutral-600
           "
            onClick={() => open?.()}
          >
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">Click to upload</div>
            {value && (
              <div className="absolute inset-0 w-full h-full">
                <Image alt="upload" fill style={{ objectFit: "cover" }} src={value} />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;

type Persona = {
  name: string;
} & ({ gender: "male"; salary: number } | { gender: "female"; age: number });
