'use client';

import React, { useRef, useState } from "react";
import { RevealWrapper } from "./RevealWrapper";
import SvgCustom from "@/utils/svg";
import { BaseComponentProps } from "@/types/component-props";
import clsx from "clsx";
import EditableTextSederhana from "./EditableTextSederhana";
import EditableText from "./EditableText";

function Profile({
  payload,
  setPayload,
  session,
  showPencil = false,
  setShowPencil,
}: BaseComponentProps) {
  const { SvgIG, SvgArrow, SvgPencil } = SvgCustom();
  const [isHoveringPhotoPutri, setIsHoveringPhotoPutri] = useState(false);
  const [isHoveringPhotoPutra, setIsHoveringPhotoPutra] = useState(false);
  const fileInputPutriRef = useRef<HTMLInputElement>(null);
  const fileInputPutraRef = useRef<HTMLInputElement>(null);
  
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
            <div 
              className={clsx('relative', 'inline-block')}
              onMouseEnter={() => session && setIsHoveringPhotoPutri(true)}
              onMouseLeave={() => session && setIsHoveringPhotoPutri(false)}
            >
              {(showPencil || (session && isHoveringPhotoPutri)) && (
                <div className={clsx('absolute', 'top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2', 'z-10')}>
                  <button
                    type="button"
                    onClick={() => fileInputPutriRef.current?.click()}
                    className={clsx('inline-flex', 'items-center', 'bg-white', 'rounded-full', 'p-2', 'shadow-lg')}
                  >
                    <SvgPencil className={clsx('w-6', 'h-6', 'text-gray-800')} />
                  </button>
                  <input
                    ref={fileInputPutriRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPayload((prev) => ({
                          ...prev,
                          photoPutri: URL.createObjectURL(file)
                        }));
                      }
                    }}
                  />
                </div>
              )}
              <img
                src={payload?.photoPutri || "/assets/images/cewe.webp"}
                alt="Putri"
                className={clsx(
                  'translate-x-[3rem]',
                  'transition-opacity duration-300',
                  (showPencil || (session && isHoveringPhotoPutri)) ? 'opacity-50 cursor-pointer' : 'opacity-100',
                  session ? 'cursor-pointer' : ''
                )}
                onClick={() => {
                  if (session) {
                    fileInputPutriRef.current?.click();
                  }
                }}
                onDoubleClick={() => {
                  if (!session && setShowPencil) {
                    setShowPencil(prev => !prev);
                  }
                }}
              />
            </div>
          </RevealWrapper>
        </div>
        <div className={clsx('flex', 'flex-col', 'items-end', 'text-right', 'gap-6', 'mt-12')}>
          <RevealWrapper duration={1500} origin="bottom">
            <h1 className={clsx('italic', 'text-2xl', 'font-light')}>
              Rizkianty Retha Nurtriana
            </h1>
          </RevealWrapper>
          <p className={clsx('text-sm', 'leading-relaxed')}>
            <strong>Putri dari</strong>
            <br />
            Bapak <EditableText
              value={payload.namaAyahPutri}
              onChange={(value) => setPayload({ ...payload, namaAyahPutri: value })}
              placeholder="Nama Ayah Putri"
              session={session}
              showPencil={showPencil}
              setShowPencil={setShowPencil}
            /> dan
            <br />
            Ibu <EditableText
              value={payload.namaIbuPutri}
              onChange={(value) => setPayload({ ...payload, namaIbuPutri: value })}
              placeholder="Nama Ibu Putri"
              session={session}
              showPencil={showPencil}
              setShowPencil={setShowPencil}
            />
          </p>
          {session ? (
            <div
              className={clsx('text-sm', 'text-white', 'bg-[#424242]', 'px-[0.4375rem]', 'py-1', 'rounded-[0.625rem]', 'flex', 'items-center', 'gap-1')}
            >
              <SvgIG />
              <EditableTextSederhana
                value={payload.namaPutri}
                onChange={(value) => setPayload({ ...payload, namaPutri: value })}
                placeholder="Nama Putri"
                session={session}
                showPencil={showPencil}
                setShowPencil={setShowPencil}
              />
              <SvgArrow />
            </div>
          ) : (
            <a
              href={`https://www.instagram.com/${payload.namaPutri || 'lemonnestt'}/`}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx('text-sm', 'text-white', 'bg-[#424242]', 'px-[0.4375rem]', 'py-1', 'rounded-[0.625rem]', 'flex', 'items-center', 'gap-1', 'hover:scale-90', 'ease-linear', 'duration-[0.2s]')}
            >
              <SvgIG />
              <EditableTextSederhana
                value={payload.namaPutri}
                onChange={(value) => setPayload({ ...payload, namaPutri: value })}
                placeholder="Nama Putri"
                session={session}
                showPencil={showPencil}
                setShowPencil={setShowPencil}
              />
              <SvgArrow />
            </a>
          )}
        </div>
        <div className={clsx('grid', 'grid-cols-2', 'mt-20')}>
          <RevealWrapper duration={1500} origin="left">
            <div 
              className={clsx('relative', 'inline-block')}
              onMouseEnter={() => session && setIsHoveringPhotoPutra(true)}
              onMouseLeave={() => session && setIsHoveringPhotoPutra(false)}
            >
              {(showPencil || (session && isHoveringPhotoPutra)) && (
                <div className={clsx('absolute', 'top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2', 'z-10')}>
                  <button
                    type="button"
                    onClick={() => fileInputPutraRef.current?.click()}
                    className={clsx('inline-flex', 'items-center', 'bg-white', 'rounded-full', 'p-2', 'shadow-lg')}
                  >
                    <SvgPencil className={clsx('w-6', 'h-6', 'text-gray-800')} />
                  </button>
                  <input
                    ref={fileInputPutraRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPayload((prev) => ({
                          ...prev,
                          photoPutra: URL.createObjectURL(file)
                        }));
                      }
                    }}
                  />
                </div>
              )}
              <img
                src={payload?.photoPutra || "/assets/images/cowo.webp"}
                alt="Putra"
                className={clsx(
                  '-translate-x-[3rem]',
                  'transition-opacity duration-300',
                  (showPencil || (session && isHoveringPhotoPutra)) ? 'opacity-50 cursor-pointer' : 'opacity-100',
                  session ? 'cursor-pointer' : ''
                )}
                onClick={() => {
                  if (session) {
                    fileInputPutraRef.current?.click();
                  }
                }}
                onDoubleClick={() => {
                  if (!session && setShowPencil) {
                    setShowPencil(prev => !prev);
                  }
                }}
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
              Akbar Pramono Ramadhan
            </h1>
          </RevealWrapper>
          <p className={clsx('text-sm', 'leading-relaxed')}>
            <strong>Putra dari</strong>
            <br />
            Bapak <EditableText
              value={payload.namaAyahPutra}
              onChange={(value) => setPayload({ ...payload, namaAyahPutra: value })}
              placeholder="Nama Ayah Putra"
              session={session}
              showPencil={showPencil}
              setShowPencil={setShowPencil}
            /> dan
            <br />
            Ibu <EditableText
              value={payload.namaIbuPutra}
              onChange={(value) => setPayload({ ...payload, namaIbuPutra: value })}
              placeholder="Nama Ibu Putra"
              session={session}
              showPencil={showPencil}
              setShowPencil={setShowPencil}
            />
          </p>
          {session ? (
            <div
              className={clsx('text-sm', 'text-white', 'bg-[#424242]', 'px-[0.4375rem]', 'py-1', 'rounded-[0.625rem]', 'flex', 'items-center', 'gap-1')}
            >
              <SvgIG />
              <EditableTextSederhana
                value={payload.namaPutra}
                onChange={(value) => setPayload({ ...payload, namaPutra: value })}
                placeholder="Nama Putra"
                session={session}
                showPencil={showPencil}
                setShowPencil={setShowPencil}
              />
              <SvgArrow />
            </div>
          ) : (
            <a
              href={`https://www.instagram.com/${payload.namaPutra || 'akbar'}/`}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx('text-sm', 'text-white', 'bg-[#424242]', 'px-[0.4375rem]', 'py-1', 'rounded-[0.625rem]', 'flex', 'items-center', 'gap-1', 'hover:scale-90', 'ease-linear', 'duration-[0.2s]')}
            >
              <SvgIG />
              <EditableTextSederhana
                value={payload.namaPutra}
                onChange={(value) => setPayload({ ...payload, namaPutra: value })}
                placeholder="Nama Putra"
                session={session}
                showPencil={showPencil}
                setShowPencil={setShowPencil}
              />
              <SvgArrow />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export default Profile;
