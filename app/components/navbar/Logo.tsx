"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; 
//antes era de next/router pero ahora son muy prehistoricos cambiando todo

const Logo = () => {
  const router = useRouter();

  return (
    <Image
    onClick={() => router.push('/')}
      alt="logo"
      className="hidden md:block cursor-pointer"
      height="100"
      width="200"
      priority
      src="/images/logo.png"
    />
  );
};

export default Logo;
