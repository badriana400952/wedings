import React from "react";
import { BaseComponentProps } from "@/types/component-props";
import { RevealWrapper } from "./RevealWrapper";
import SvgCustom from "@/utils/svg";
import clsx from "clsx";

function Gallery({}: BaseComponentProps) {
    const { SvgQuot } = SvgCustom()
    return (
        <section id="gallery">
            <div className={clsx(`bg-[url('/assets/images/bg.webp')]`, 'bg-cover', 'bg-center', 'relative', 'px-8', 'py-16')}>
                <div className={clsx('bg-transparent', 'bg-[linear-gradient(360deg,#EAEAEA_53%,#424242_100%)]', 'opacity-90', 'absolute', 'inset-0')}></div>
                <div className={clsx('z-10', 'relative')}>
                    <h1 className={clsx('text-xl', 'italic', 'font-light', 'text-center', 'text-white')}>
                        Our Gallery
                    </h1>
                    <div className={clsx('flex', 'flex-col', 'items-center', 'text-center', 'gap-4', 'my-10')}>
                        <img
                            src="/assets/images/a3.jpeg"
                            alt="quote"
                            className={clsx('w-[170px]', 'h-[220px]', 'object-cover')}
                        />
                        <RevealWrapper origin="top" duration={1500}>
                            <span>
                                <SvgQuot color="#4242427A" fontSize="1.75rem" />
                            </span>
                        </RevealWrapper>
                        <RevealWrapper origin="top" duration={1500}>
                            <p className={clsx('text-[0.8rem]', 'font-light', 'leading-loose', 'px-8')}>
                                From when I first saw you, I felt that I was finally home, all I
                                want is to make your dreams come true and share our dreams
                                together.
                            </p>
                        </RevealWrapper>
                    </div>
                    <RevealWrapper origin="right" duration={1500}>
                        <img
                            src="/assets/images/a4.jpeg"
                            alt="big-grid"
                            className={clsx('w-full', 'h-96', 'object-cover', 'object-bottom')}
                        />
                    </RevealWrapper>
                    <RevealWrapper origin="top" duration={1500}>
                        <div className={clsx('grid', 'grid-cols-3', 'gap-1', 'mt-1')}>
                            <img
                                src="/assets/images/a5.jpeg"
                                alt="grid-1"
                                className={clsx('h-32', 'object-cover', 'w-full')}
                            />
                            <img
                                src="/assets/images/a6.jpeg"
                                alt="grid-2"
                                className={clsx('h-32', 'object-cover', 'w-full')}
                            />
                            <img
                                src="/assets/images/a7.jpeg"
                                alt="grid-3"
                                className={clsx('h-32', 'object-cover', 'w-full')}
                            />
                        </div>
                    </RevealWrapper>
                </div>
            </div>
        </section>
    );
}

export default Gallery;