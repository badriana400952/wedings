'use client';

import { formatTanggalIndo } from '@/date';
import { ITemplateWeding } from '@/prisma/schema.types';
import clsx from 'clsx';
import Image from 'next/image';
interface Pr {
  payload: ITemplateWeding
  setPayload: React.Dispatch<React.SetStateAction<ITemplateWeding>>
}
const HomePage: React.FC<Pr> = ({ payload, setPayload }) => {
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

        <Image
          src={
            typeof payload.fotoHeader === "string"
              ? payload.fotoHeader
              : URL.createObjectURL(payload.fotoHeader)
          }
          alt="bg"
          width={208}
          height={208}
          className={clsx('img-center-crop', 'rounded-circle', 'border-4', 'border-gray-300', 'dark:border-gray-600', 'shadow', 'my-4', 'mx-auto', 'cursor-pointer')}
          priority
        />

        <h2 className={clsx('font-esthetic', 'my-4', 'text-gray-900', 'dark:text-white')} style={{ fontSize: '2.25rem' }}>
          {payload.namaPutra || "Badriana"} & {payload.namaPutri || "Izzah"}
        </h2>

        <p className={clsx('my-2', 'text-gray-800', 'dark:text-gray-200')} style={{ fontSize: '1.25rem' }}>
          {formatTanggalIndo(payload?.tanggalPernikahan)}
        </p>

        <a
          href={payload.linkGoogleCalender}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx('btn', 'btn-outline-auto', 'btn-sm', 'shadow', 'rounded-pill', 'px-3', 'py-1', 'text-gray-900', 'dark:text-white', 'border-gray-900', 'dark:border-white', 'hover:bg-gray-900', 'hover:text-white', 'dark:hover:bg-white', 'dark:hover:text-gray-900', 'cursor-pointer')}
          style={{ fontSize: '0.825rem', textDecoration: 'none' }}
        >
          <i className={clsx('fa-solid', 'fa-calendar-check', 'me-2')}></i>Save Google Calendar
        </a>

        <div className={clsx('d-flex', 'justify-content-center', 'align-items-center', 'mt-4', 'mb-2')}>
          <div className={clsx('mouse-animation', 'border', 'border-secondary', 'border-2', 'rounded-5', 'px-2', 'py-1', 'opacity-50')}>
            <div className={clsx('scroll-animation', 'rounded-4', 'bg-secondary')}></div>
          </div>
        </div>

        <p className={clsx('pb-4', 'm-0', 'text-secondary')} style={{ fontSize: '0.825rem' }}>Scroll Down</p>
      </div>
    </section>
  );
}
export default HomePage