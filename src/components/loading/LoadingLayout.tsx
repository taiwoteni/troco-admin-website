'use client';

import { CSSProperties, HTMLAttributes} from "react";
import LottieWidget from "../lottie/LottieWidget";

interface props{
    lottie:unknown,
    label:string,
    loop?:boolean,
    className?:HTMLAttributes<HTMLParagraphElement> | string,
    style?: CSSProperties
}


function LoadingLayout({lottie, label, style, loop = true, className}:props){

    return <div className={`bg-white w-full h-[100vh] justify-center items-center flex flex-col gap-3 ${className}`} style={style}>
        <LottieWidget className="w-[200px] h-[200px]" loop={loop} lottieAnimation={lottie} />
        <p className="font-bold text-black font-quicksand text-[3vh]">{label}</p>
    </div>
}

export default LoadingLayout;