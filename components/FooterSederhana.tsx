import React from "react";
import { BaseComponentProps } from "@/types/component-props";
import { RevealWrapper } from "./RevealWrapper";
import clsx from "clsx";

function Footer({}: BaseComponentProps) {
  return (
    <section id="footer">
      <div className={clsx('h-screen', `bg-[url('/assets/images/a4.jpeg')]`, 'bg-cover', 'bg-[47.5%]', 'bg-no-repeat', 'flex', 'items-end')}>
        <div className="relative">
          <div className={clsx('bg-[linear-gradient(180deg,#FFFFFF00_0%,#424242_67%)]', 'absolute', 'inset-x-0', 'bottom-0', '-top-24')}></div>
          <div className={clsx('flex', 'flex-col', 'items-center', 'text-center', 'gap-4', 'text-white', 'p-6', 'z-10', 'relative')}>
            <RevealWrapper duration={1500} origin="top">
              <p className={clsx('text-[0.75rem]', 'font-light', 'leading-relaxed')}>
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
                Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu
                kepada kami. Atas kehadiran dan doanya kami mengucapkan
                terimakasih
              </p>
            </RevealWrapper>
            <RevealWrapper duration={1500} origin="top">
              <p className={clsx('text-[0.75rem]', 'font-light', 'leading-relaxed')}>
                Wassalamualaikum Warahmatullahi Wabarakatuh
              </p>
            </RevealWrapper>
            <RevealWrapper duration={1500} origin="bottom">
              <h1 className={clsx('text-[1.75rem]', 'font-light')}>Akbar & Retha</h1>
            </RevealWrapper>
          </div>
        </div>
      </div>
      <div className={clsx('bg-[#424242]', 'p-20', 'flex', 'items-center', 'justify-center')}>
        <p className={clsx('text-white', 'text-sm')}>© 2024 Wedding Invitation</p>
      </div>
    </section>
  );
}

export default Footer;