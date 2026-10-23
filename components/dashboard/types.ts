import React from 'react';

export type DashboardTab =
  | 'overview'
  | 'mempelai'
  | 'acara'
  | 'gift'
  | 'galeri'
  | 'bersama'
  | 'musik'
  | 'ucapan'
  | 'cerita'
  | 'template'
  | 'links';

export interface DashboardStats {
  comments: number;
  likes: number;
  present: number;
  absent: number;
}

export interface DashboardComment {
  id: string;
  name: string;
  comment: string;
  presence: boolean;
  likes: number;
  createdAt: string;
}

export interface UcapanRow {
  id: string;
  name: string;
  ucapan: string;
  createdAt: string;
}

export type RsvpRow = {
  isRsvp: boolean;
  status: 'attending' | 'not_attending' | 'maybe' | null;
  label: string;
  detail: string;
};

export interface WeddingFormData {
  fotoHeader: string;
  namaLengkapPutra: string;
  namaPutra: string;
  namaAyahPutra: string;
  namaIbuPutra: string;
  kelahiranPutra: string;
  instagramPutra: string;
  photoPutra: string;
  namaLengkapPutri: string;
  namaPutri: string;
  namaAyahPutri: string;
  namaIbuPutri: string;
  kelahiranPutri: string;
  instagramPutri: string;
  photoPutri: string;
  tanggalPernikahan: string;
  linkGoogleCalender: string;
  tanggalAkad: string;
  jamAkad: string;
  lokasiAkad: string;
  alamatAkad: string;
  tanggalResepsi: string;
  jamResepsi: string;
  jamSelesai: string;
  lokasiResepsi: string;
  alamatPernikahan: string;
  linkMaps: string;
  isGiftActive: boolean;
  isBankActive: boolean;
  namaBank: string;
  noAtm: string;
  noHp: string;
  isQrisActive: boolean;
  fotoQris: string;
}
