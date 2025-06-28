'use client';

import Image from "next/image";
import trocoWhiteImage from "../assets/troco-white.png"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Routes from "./routes";
import { getAdminDetails } from "@/utils/storage/admin-storage";

export default function Home() {
  const [textVisible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    const textI = setTimeout(() => {
      setVisible(true);
    }, 2000);

    const changeT = setTimeout(()=>{
      router.replace(getAdminDetails()? Routes.dashboard.path:Routes.auth.path);
    }, 5000)

    return ()=>{
      clearTimeout(textI)
      clearTimeout(changeT)
    }
  }, [router])

  return (
    <div className="w-full h-full flex flex-col bg-themeColor items-center justify-center relative">
      <Image src={trocoWhiteImage} alt="Troco Image" className="w-[250px] aspect-[5/1]"/>

      {textVisible && <p className="text-white text-sm font-quicksand absolute bottom-[40%]">{"We're setting up, give us a few minutes..."}</p>}
      
    </div>
  );
}
