import React, { Children, CSSProperties, forwardRef, ReactNode, Ref, useEffect, useImperativeHandle, useState } from 'react'

export interface CarouselRefType {
    next: ()=> void,
    back: ()=> void
}

type props = {
    width?: number | string,
    height?: number | string,
    style?: CSSProperties,
    children?: ReactNode,
    /**
     * The initial position of the slider
     */
    initialIndex?: number,
    className?:string,
    /**
     * If you want the slider to be endless
     */
    endless?:boolean,
    /**
     * The slide duration of the page slider
     */
    slideDuration?:number,

    /**
     * A callback that is invoked everytime a page or rather, the @param currentIndex is changed
     * @param index the index of the page that will be viewed after the callback.
     * @returns nothing
     */
    onChange?: (index:number) => void,

    /**
     * The gap between the pages
     */
    gap?:string | undefined,
}

function Carousel(props: props, ref?: Ref<CarouselRefType>) {

    const {width='100%', height='100%', initialIndex=0, slideDuration=1000, gap='20px', endless=false, style, onChange=()=>{}, className, children} = props

    const [index, setIndex] = useState(initialIndex);

    const pagesCount = Children.count(children);

    useEffect(()=>{
        onChange(index);
    },[index, onChange])

    function next(){
        setIndex(curr => curr === pagesCount-1? (!endless? curr : 0) : curr+1);
    }

    function back(){
        setIndex(curr => curr === 0? (endless? pagesCount-1 : curr) : curr-1);
    }

    useImperativeHandle(ref, ()=>({
        back,
        next,
    }))

  return (
    <div className={`w-full h-full ${className} overflow-x-hidden custom-scrollbar`} style={{width, height,...style}}>
        <div className={`flex w-full h-full items-center transition-transform ease-out duration-500`}
            style={{gap, transform:`translateX(${index===0? `-${index * 100}%`: `calc(-${index * 100}% - (${index} * ${gap}))`})`, transitionDuration:`${slideDuration}ms`, transitionTimingFunction:'ease',}}>
                {Children.map(children, (child)=>{
                    return <div className='flex-grow-0 flex-shrink-0 w-full h-full' style={{flexBasis:'100%'}}>{child}</div>
                })}

        </div>
        
    </div>
  )
}

const WrappedCarousel = forwardRef(Carousel); 

export {WrappedCarousel as Carousel};
