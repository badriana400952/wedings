'use client';

import { formatTanggalIndo } from '@/date';
import { ITemplateWeding } from '@/prisma/schema.types';
import clsx from 'clsx';
import Image from 'next/image';
import { useRef, useState } from 'react';
import SvgCustom from '@/utils/svg';
import Calendar from './Calendar';

interface Pr {
  payload: ITemplateWeding
  setPayload: React.Dispatch<React.SetStateAction<ITemplateWeding>>
  showPencil: boolean
  setShowPencil: React.Dispatch<React.SetStateAction<boolean>>
  session: string | undefined
}

const HomePage: React.FC<Pr> = ({ payload, setPayload, showPencil, setShowPencil, session }) => {
  const { SvgPencil } = SvgCustom()
  const [isEditingNamaPutra, setIsEditingNamaPutra] = useState(false)
  const [isEditingNamaPutri, setIsEditingNamaPutri] = useState(false)
  const [isEditingTanggalPernikahan, setIsEditingTanggalPernikahan] = useState(false)
  const [isEditingLinkGoogleCalendar, setIsEditingLinkGoogleCalendar] = useState(false)
  const [isHoveringImage, setIsHoveringImage] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <section id="home" className={clsx('bg-light-dark', 'position-relative', 'overflow-hidden', 'p-0', 'm-0')}>
      <div className={clsx('position-absolute', 'opacity-25', 'top-50', 'start-50', 'translate-middle')} style={{ width: '100%', height: '100%' }}>
        <Image
          src={
            typeof payload.fotoHeader === "string"
              ? payload.fotoHeader
              : URL.createObjectURL(payload.fotoHeader)
          }
          alt="bg"
          fill
          className="bg-cover-home"
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      <div className={clsx('position-relative', 'text-center', 'bg-overlay-auto')} style={{ backgroundColor: 'unset' }}>
        <h1 className={clsx('font-esthetic', 'pt-5', 'pb-4', 'fw-medium', 'text-gray-900', 'dark:text-white')} style={{ fontSize: '2.25rem' }}>
          Undangan Pernikahan
        </h1>

        {/* Container untuk image dan pencil */}
        <div 
          className={clsx('relative', 'inline-block')}
          onMouseEnter={() => session && setIsHoveringImage(true)}
          onMouseLeave={() => session && setIsHoveringImage(false)}
        >
          {(showPencil || (session && isHoveringImage)) && (
            <div
              className={clsx(
                "absolute",
                "top-1/2",
                "left-1/2",
                "transform",
                "-translate-x-1/2",
                "-translate-y-1/2",
                "z-10"
              )}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={clsx(
                  'inline-flex',
                  'items-center',
                  'text-white',
                  'bg-brand',
                  'hover:bg-brand-strong',
                  'box-border',
                  'border-none',
                  'border-transparent',
                  'shadow-xs',
                  'font-medium',
                  'leading-5',
                  'rounded-base',
                  'text-sm',
                  'px-3',
                  'py-2',
                  'focus:outline-none',
                  'focus:ring-0'
                )}
              >
                <SvgPencil className={clsx('w-9', 'h-9', 'text-gray-800')} />
              </button>

              <input
                ref={fileInputRef}
                id="dropzone-file-home"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setPayload((prev) => ({
                      ...prev,
                      fotoHeader: file
                    }))
                  }
                }}
              />
            </div>
          )}

          <Image
            src={
              typeof payload.fotoHeader === "string"
                ? payload.fotoHeader
                : URL.createObjectURL(payload.fotoHeader)
            }
            alt="bg"
            width={208}
            height={208}
            className={clsx(
              'img-center-crop',
              'rounded-circle',
              'border-4',
              'border-gray-300',
              'dark:border-gray-600',
              'shadow',
              'my-4',
              'mx-auto',
              'transition-opacity duration-300',
              (showPencil || (session && isHoveringImage)) ? 'opacity-50 cursor-pointer' : 'opacity-100',
              session ? 'cursor-pointer' : ''
            )}
            priority
            onClick={() => {
              // Jika session ada id-nya (user logged in), maka ketika diklik muncul upload
              if (session) {
                fileInputRef.current?.click()
              }
            }}
            onDoubleClick={() => {
              // Jika data?.user.id ada id nya (user logged in), maka gambar tidak bisa di doubleclick
              if (session) {
                return; // Tidak melakukan apa-apa jika user logged in
              }
              setShowPencil(prev => !prev)
            }}
          />
        </div>

        <h2 className={clsx('font-esthetic', 'my-4', 'text-gray-900', 'dark:text-white')} style={{ fontSize: '2.25rem' }}>
          {showPencil || (session && isEditingNamaPutra) ? (
            <input
              type="text"
              placeholder="Isi Nama"
              onDoubleClick={() => {
                // Jika data?.user.id ada id nya (user logged in), maka gambar tidak bisa di doubleclick
                if (session) {
                  return; // Tidak melakukan apa-apa jika user logged in
                }
                setShowPencil(prev => !prev)
              }}
              onChange={((e) => setPayload({ ...payload, namaPutra: e.target.value }))}
              onBlur={() => session && setIsEditingNamaPutra(false)}
              className={clsx('bg-transparent', 'border-none', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-center', 'w-full')}
              autoFocus
            />
          ) : (
            <span
              onClick={() => session && setIsEditingNamaPutra(true)}
              className={clsx(session ? 'cursor-pointer hover:opacity-80' : '')}
            >
              {payload.namaPutra}
            </span>
          )}

          <br /> & <br />

          {showPencil || (session && isEditingNamaPutri) ? (
            <input
              type="text"
              placeholder="Isi Nama"
              onDoubleClick={() => {
                // Jika data?.user.id ada id nya (user logged in), maka gambar tidak bisa di doubleclick
                if (session) {
                  return; // Tidak melakukan apa-apa jika user logged in
                }
                setShowPencil(prev => !prev)
              }}
              onChange={((e) => setPayload({ ...payload, namaPutri: e.target.value }))}
              onBlur={() => session && setIsEditingNamaPutri(false)}
              className={clsx('bg-transparent', 'border-none', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-center', 'w-full')}
              autoFocus={isEditingNamaPutri}
            />
          ) : (
            <span
              onClick={() => session && setIsEditingNamaPutri(true)}
              className={clsx(session ? 'cursor-pointer hover:opacity-80' : '')}
            >
              {payload.namaPutri}
            </span>
          )}
        </h2>

        <div className={clsx('my-2', 'text-gray-800', 'dark:text-gray-200')} style={{ fontSize: '1.25rem' }}>
          {showPencil ? (
            <input
              type="date"
              value={payload?.tanggalPernikahan || ''}
              onChange={(e) => setPayload({ ...payload, tanggalPernikahan: e.target.value })}
              onBlur={() => setShowPencil(false)}
              className={clsx('bg-transparent', 'border-none', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-center', 'w-full')}
              autoFocus
            />
          ) : (
            <span
              onClick={() => {
                if (session) {
                  setShowCalendar(true)
                }
              }}
              className={clsx(session ? 'cursor-pointer hover:opacity-80' : '')}
            >
              {formatTanggalIndo(payload?.tanggalPernikahan)}
            </span>
          )}
        </div>

        <div className="mt-3">
          {showPencil || (session && isEditingLinkGoogleCalendar) ? (
            <input
              type="url"
              placeholder="https://calendar.google.com/..."
              value={payload.linkGoogleCalender || ''}
              onChange={(e) => setPayload({ ...payload, linkGoogleCalender: e.target.value })}
              onBlur={() => session && setIsEditingLinkGoogleCalendar(false)}
              className={clsx('bg-transparent', 'border', 'border-gray-300', 'dark:border-gray-600', 'rounded-pill', 'outline-none', 'focus:outline-none', 'focus:ring-0', 'shadow-none', 'text-center', 'w-full', 'px-3', 'py-1', 'text-sm')}
              autoFocus
            />
          ) : (
            <a
              href={payload.linkGoogleCalender}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (session) {
                  e.preventDefault()
                  setIsEditingLinkGoogleCalendar(true)
                }
              }}
              className={clsx('btn', 'btn-outline-auto', 'btn-sm', 'shadow', 'rounded-pill', 'px-3', 'py-1', 'text-gray-900', 'dark:text-white', 'border-gray-900', 'dark:border-white', 'hover:bg-gray-900', 'hover:text-white', 'dark:hover:bg-white', 'dark:hover:text-gray-900', session ? 'cursor-pointer' : '')}
              style={{ fontSize: '0.825rem', textDecoration: 'none' }}
            >
              <i className={clsx('fa-solid', 'fa-calendar-check', 'me-2')}></i>Save Google Calendar
            </a>
          )}
        </div>

        <div className={clsx('d-flex', 'justify-content-center', 'align-items-center', 'mt-4', 'mb-2')}>
          <div className={clsx('mouse-animation', 'border', 'border-secondary', 'border-2', 'rounded-5', 'px-2', 'py-1', 'opacity-50')}>
            <div className={clsx('scroll-animation', 'rounded-4', 'bg-secondary')}></div>
          </div>
        </div>

        <p className={clsx('pb-4', 'm-0', 'text-secondary')} style={{ fontSize: '0.825rem' }}>Scroll Down</p>
      </div>

      {showCalendar && (
        <Calendar
          selectedDate={payload?.tanggalPernikahan || ''}
          onDateSelect={(date) => {
            setPayload({ ...payload, tanggalPernikahan: date })
            setShowCalendar(false)
          }}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </section>
  );
}
export default HomePage