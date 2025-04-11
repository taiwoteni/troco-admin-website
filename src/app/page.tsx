import Image from "next/image";
import trocoWhiteImage from "../assets/troco-white.png"

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col bg-themeColor items-center justify-center">
      <Image src={trocoWhiteImage} alt="Troco Image" className="w-[250px] aspect-[5/1]"/>
      
    </div>
  );
}
