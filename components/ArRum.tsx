import React from "react";
import { BaseComponentProps } from "@/types/component-props";
import { RevealWrapper } from "./RevealWrapper";
import clsx from "clsx";

function ArRum({
  payload,
  setPayload,
  session,
  showPencil = false,
  setShowPencil,
}: BaseComponentProps) {
  return (
    <section id="qs-ar-rum">
      <div className={clsx(`bg-[url('/assets/images/bg.png')]`, 'rounded-t-[1.25rem]', 'bg-center', 'bg-no-repeat', 'bg-cover', 'p-12', 'flex', 'flex-col', 'items-center', 'text-center', 'gap-8', '-mt-8', 'z-20', 'relative', 'font-light')}>
        <RevealWrapper duration={1500} origin="top">
          <h1 className={clsx('italic', 'text-4xl', 'flex', 'gap-4', 'text-[#A99C86]')}>
            <span>{payload?.namaPutra?.charAt(0) || 'P'}</span>
            <span>&</span>
            <span>{payload?.namaPutri?.charAt(0) || 'P'}</span>
          </h1>
        </RevealWrapper>
        <RevealWrapper duration={1500} origin="top">
          <p className={clsx('text-[0.75rem]', 'leading-loose', 'text-[#424242]')}>
            "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan
            pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung
            dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa
            kasih dan sayang."
          </p>
        </RevealWrapper>
        <RevealWrapper duration={1500} origin="bottom">
          <h3 className={clsx('italic', 'text-lg')}>QS Ar-Rum 21</h3>
        </RevealWrapper>
      </div>
    </section>
  );
}

export default ArRum;