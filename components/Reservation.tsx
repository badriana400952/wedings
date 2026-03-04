"use client";

import React, { useEffect, useState } from "react";
import { BaseComponentProps } from "@/types/component-props";
import { RevealWrapper } from "./RevealWrapper";
import SvgCustom from "@/utils/svg";
import clsx from "clsx";

interface ReservationProps extends BaseComponentProps {
  guestName?: string | null;
  adminId?: string;
}

function Reservation({ payload, guestName, adminId }: ReservationProps) {
  const { SvgClock, SvgMail } = SvgCustom();
  const [inputValue, setInputValue] = useState({
    name: guestName || "",
    comment: "",
    presence: true,
  });
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (payload?.id) {
      fetchComments();
    }
  }, [payload?.id]);

  const fetchComments = async () => {
    if (!payload?.id) return;

    try {
      const res = await fetch(`/api/comments?templateWedingId=${payload.id}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleSubmit = async () => {
    if (!inputValue.name) {
      alert("Mohon masukkan nama anda.");
      return;
    }

    if (!inputValue.comment) {
      alert("Mohon berikan ucapan dan doa.");
      return;
    }

    if (!payload?.id) {
      alert("Template wedding ID tidak ditemukan");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inputValue.name,
          presence: inputValue.presence,
          comment: inputValue.comment,
          templateWedingId: payload.id,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setInputValue({
          name: guestName || "",
          comment: "",
          presence: true,
        });
        fetchComments();
        alert('✅ Terima kasih atas ucapan dan doanya!');
      } else {
        alert('❌ ' + (data.error || 'Gagal mengirim ucapan'));
      }
    } catch (error) {
      console.error('Failed to submit:', error);
      alert('❌ Gagal mengirim ucapan');
    } finally {
      setLoading(false);
    }
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  return (
    <section id="reservation">
      <div className={clsx('bg-[#F5F5F5]', 'bg-center', 'bg-no-repeat', 'bg-cover', 'px-8', 'py-16', 'lg:px-10', 'space-y-8', '-mt-4')}>
        <RevealWrapper duration={2500} origin="bottom" className="space-y-8">
          <h1 className={clsx('text-xl', 'italic', 'font-light', 'text-center')}>
            Reservation & Wishes
          </h1>
          <p className={clsx('text-center', 'text-[0.75rem]', 'text-[#424242]')}>
            Mohon mengisi konfirmasi kehadiran
            <br />
            dan berikan ucapan & doa untuk kami
          </p>
          <div className={clsx('flex', 'flex-col', 'gap-3')}>
            <input
              type="text"
              placeholder="Nama"
              className={clsx('text-[0.8rem]', 'py-2', 'px-3', 'placeholder:text-[#5a5a5a50]', 'border-b', 'border-[#A99D87]', 'rounded')}
              value={inputValue.name}
              onChange={(e) =>
                setInputValue({ ...inputValue, name: e.target.value })
              }
            />
            <textarea
              placeholder="Berikan Ucapan dan Doa"
              className={clsx('h-24', 'text-[0.8rem]', 'py-2', 'px-3', 'placeholder:text-[#5a5a5a50]', 'border-b', 'border-[#A99D87]', 'rounded')}
              value={inputValue.comment}
              onChange={(e) =>
                setInputValue({ ...inputValue, comment: e.target.value })
              }
            />
            <div className={clsx('flex', 'items-center', 'gap-2', 'text-sm')}>
              <input
                type="radio"
                name="presence"
                id="hadir"
                checked={inputValue.presence === true}
                onChange={() => setInputValue({ ...inputValue, presence: true })}
              />
              <label htmlFor="hadir">Hadir</label>
              <input
                type="radio"
                name="presence"
                id="tidak-hadir"
                checked={inputValue.presence === false}
                onChange={() => setInputValue({ ...inputValue, presence: false })}
              />
              <label htmlFor="tidak-hadir">Tidak Hadir</label>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={clsx('text-[0.75rem]', 'bg-[#424242]', 'flex', 'items-center', 'w-fit', 'rounded', 'text-white', 'gap-2', 'py-2', 'px-4', 'font-bold', 'hover:scale-90', 'ease-linear', 'duration-[0.2s]', 'disabled:opacity-50', 'disabled:cursor-not-allowed')}
            >
              <SvgMail />
              <span>{loading ? 'Mengirim...' : 'Kirim'}</span>
            </button>
          </div>
        </RevealWrapper>
        <div className="space-y-4">
          {comments.map((data) => (
            <div
              key={data.id}
              className={clsx('bg-white', 'p-4', 'border-b', 'border-[#a99d87]', 'rounded', 'font-light', 'text-[#424242]', 'flex', 'flex-col', 'gap-2')}
            >
              <p className={clsx('flex', 'items-center', 'gap-2')}>
                <span className={clsx('font-extrabold', 'text-sm')}>{data.name}</span>
                <span
                  className={`text-[0.7rem] ${
                    data.presence ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ({data.presence ? 'Hadir' : 'Tidak Hadir'})
                </span>
              </p>
              <p className="text-[0.75rem]">{data.comment}</p>
              <p className={clsx('flex', 'items-center', 'gap-1', 'text-[0.75rem]')}>
                <SvgClock />
                <span>{formatDate(data.createdAt)}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Reservation;