'use client';

import React from "react";
import { RevealWrapper } from "./RevealWrapper";
import SvgCustom from "@/utils/svg";
import { BaseComponentProps } from "@/types/component-props";
import clsx from "clsx";

function Profile({
  payload,
}: BaseComponentProps) {
  const { SvgIG, SvgArrow } = SvgCustom();

  return (
    <section id="people">
      <div className={clsx(`bg-[url('/assets/images/bg2.jpg')]`, 'bg-center', 'bg-no-repeat', 'bg-cover', 'px-12', 'py-16')}>
        <RevealWrapper duration={1500}>
          <p className={clsx('text-center', 'text-[0.75rem]', 'leading-loose', 'text-[#424242]')}>
            <strong>Bismillahirrahmanirrahim</strong>
            <br />
            Assalamu'alaikum Warahmatullaahi Wabarakaatuh. Dengan memohon Rahmat
            dan Ridho Allah SWT. Kami mengharapkan kehadiran
            Bapak/Ibu/Saudara/i. pada acara Resepsi Pernikahan putra-putri kami
          </p>
        </RevealWrapper>
        <div className={clsx('grid', 'grid-cols-2', 'mt-20')}>
          <div className={clsx('-rotate-90', 'flex', 'flex-col', 'justify-end', 'lg:mr-4', '-translate-y-4', 'lg:-translate-y-4')}>
            <RevealWrapper duration={1500} origin="bottom">
              <p className={clsx('text-[0.75rem]', 'tracking-[5px]', 'flex', 'gap-2.5', 'text-[#424242]', 'text-center')}>
                <span>THE</span>
                <span>BRIDE</span>
              </p>
            </RevealWrapper>
          </div>
          <RevealWrapper duration={1500} origin="right">
            <div className={clsx('relative', 'inline-block')}>
              <img
                src={
                  typeof payload?.photoPutri === 'string'
                    ? payload.photoPutri
                    : "/assets/images/cewe.webp"
                }
                alt="Putri"
                className={clsx('translate-x-[3rem]', 'opacity-100')}
              />
            </div>
          </RevealWrapper>
        </div>
        <div className={clsx('flex', 'flex-col', 'items-end', 'text-right', 'gap-6', 'mt-12')}>
          <RevealWrapper duration={1500} origin="bottom">
            <h1 className={clsx('italic', 'text-2xl', 'font-light')}>
              {payload.namaLengkapPutri || payload.namaPutri || 'Mempelai Wanita'}
            </h1>
          </RevealWrapper>
          <p className={clsx('text-sm', 'leading-relaxed')}>
            <strong>Putri dari</strong>
            <br />
            Bapak {payload.namaAyahPutri || '-'} dan
            <br />
            Ibu {payload.namaIbuPutri || '-'}
          </p>
          <a
            href={`https://www.instagram.com/${payload.instagramPutri || payload.namaPutri || 'wedding'}/`}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx('text-sm', 'text-white', 'bg-[#424242]', 'px-[0.4375rem]', 'py-1', 'rounded-[0.625rem]', 'flex', 'items-center', 'gap-1', 'hover:scale-90', 'ease-linear', 'duration-[0.2s]')}
          >
            <SvgIG />
            <span>{payload.namaPutri || 'Instagram'}</span>
            <SvgArrow />
          </a>
        </div>
        <div className={clsx('grid', 'grid-cols-2', 'mt-20')}>
          <RevealWrapper duration={1500} origin="left">
            <div className={clsx('relative', 'inline-block')}>
              <img
                src={
                  typeof payload?.photoPutra === 'string'
                    ? payload.photoPutra
                    : "/assets/images/cowo.webp"
                }
                alt="Putra"
                className={clsx('-translate-x-[3rem]', 'opacity-100')}
              />
            </div>
          </RevealWrapper>
          <div className={clsx('rotate-90', 'flex', 'flex-col', 'justify-end', 'lg:ml-4', 'translate-y-4', 'lg:translate-y-8')}>
            <RevealWrapper duration={1500} origin="bottom">
              <p className={clsx('text-[0.75rem]', 'tracking-[5px]', 'flex', 'gap-2.5', 'text-[#424242]', 'text-center')}>
                <span>THE</span>
                <span>GROOM</span>
              </p>
            </RevealWrapper>
          </div>
        </div>
        <div className={clsx('flex', 'flex-col', 'items-start', 'text-left', 'gap-6', 'mt-12')}>
          <RevealWrapper duration={1500} origin="bottom">
            <h1 className={clsx('italic', 'text-2xl', 'font-light')}>
              {payload.namaLengkapPutra || payload.namaPutra || 'Mempelai Pria'}
            </h1>
          </RevealWrapper>
          <p className={clsx('text-sm', 'leading-relaxed')}>
            <strong>Putra dari</strong>
            <br />
            Bapak {payload.namaAyahPutra || '-'} dan
            <br />
            Ibu {payload.namaIbuPutra || '-'}
          </p>
          <a
            href={`https://www.instagram.com/${payload.instagramPutra || payload.namaPutra || 'wedding'}/`}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx('text-sm', 'text-white', 'bg-[#424242]', 'px-[0.4375rem]', 'py-1', 'rounded-[0.625rem]', 'flex', 'items-center', 'gap-1', 'hover:scale-90', 'ease-linear', 'duration-[0.2s]')}
          >
            <SvgIG />
            <span>{payload.namaPutra || 'Instagram'}</span>
            <SvgArrow />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Profile;
