'use client';

import { formatTanggalIndo } from '@/date';
import { ITemplateWeding } from '@/prisma/schema.types';
import clsx from 'clsx';
import Image from 'next/image';
import { useRef, useState } from 'react';
import SvgCustom from '@/utils/svg';
import Calendar from './Calendar';
import EditableText from './EditableText';
import EditableDate from './EditableDate';
import EditableLink from './EditableLink';

interface Pr {
  payload: ITemplateWeding
  setPayload: React.Dispatch<React.SetStateAction<ITemplateWeding>>
  showPencil: boolean
  setShowPencil: React.Dispatch<React.SetStateAction<boolean>>
  session: string | undefined
  isAdminView?: boolean
}

const HomePage: React.FC<Pr> = ({ payload, setPayload, showPencil, setShowPencil, session }) => {
  const { SvgPencil } = SvgCustom()
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
          <EditableText
            value={payload.namaPutra}
            onChange={(value) => setPayload({ ...payload, namaPutra: value })}
            placeholder="Isi Nama Putra"
            session={session}
            showPencil={showPencil}
            setShowPencil={setShowPencil}
          />

          <br /> & <br />

          <EditableText
            value={payload.namaPutri}
            onChange={(value) => setPayload({ ...payload, namaPutri: value })}
            placeholder="Isi Nama Putri"
            session={session}
            showPencil={showPencil}
            setShowPencil={setShowPencil}
          />
        </h2>

        <div className={clsx('my-2', 'text-gray-800', 'dark:text-gray-200')} style={{ fontSize: '1.25rem' }}>
          <EditableDate
            value={payload?.tanggalPernikahan || ''}
            onChange={(value) => setPayload({ ...payload, tanggalPernikahan: value })}
            formatDisplay={formatTanggalIndo}
            session={session}
            showPencil={showPencil}
            setShowPencil={setShowPencil}
            onCalendarClick={() => setShowCalendar(true)}
          />
        </div>

        <div className="mt-3">
          <EditableLink
            value={payload.linkGoogleCalender || ''}
            onChange={(value) => setPayload({ ...payload, linkGoogleCalender: value })}
            placeholder="https://calendar.google.com/..."
            session={session}
            showPencil={showPencil}
            setShowPencil={setShowPencil}
            linkText="Save Google Calendar"
            linkIcon="fa-calendar-check"
          />
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