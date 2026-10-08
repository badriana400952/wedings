//////////////////////
// ENUM
//////////////////////

export enum Role {
  ADMIN = "ADMIN",
  DEV = "DEV",
}

export enum DesignThemes {
  CLASSIC = "CLASSIC",
  MODERN = "MODERN",
  ELEGANT = "ELEGANT",
  MINIMALIST = "MINIMALIST",
}

//////////////////////
// USER
//////////////////////

export interface IUser {
  id: string
  email: string
  name: string
  password: string
  accessKey: string
  tz: string
  tenorKey?: string | null
  isFilter: boolean
  isConfettiAnimation: boolean
  canReply: boolean
  canEdit: boolean
  canDelete: boolean
  role: Role
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  templateWeding?: ITemplateWeding | null
  sessions: ISession[]
}

//////////////////////
// TEMPLATE WEDDING
//////////////////////

export interface ITemplateWeding {
  id: string
  userId: string
  user: IUser

  designTheme: DesignThemes

  fotoHeader: string | File
  fotoHeader2?: string | File
  fotoHeader3?: string | File
  fotoHeader4?: string | File

  // Groom
  template:string
  namaPutra: string
  namaLengkapPutra: string
  namaAyahPutra: string
  namaIbuPutra: string
  kelahiranPutra?: string
  instagramPutra: string
  photoPutra: string | File

  // Bride
  namaPutri: string
  namaLengkapPutri: string
  namaAyahPutri: string
  namaIbuPutri: string
  kelahiranPutri?: string
  instagramPutri: string
  photoPutri: string | File

  // Wedding Info
  tanggalPernikahan: string 
  linkGoogleCalender: string
  alamatGedungPernikahan: string
  alamatPernikahan: string
  jamMulai: string
  jamResepsi: string
  jamSelesai: string
  linkMaps: string

  // Detail Jadwal Akad & Resepsi
  tanggalAkad?: string | Date
  jamAkad?: string
  lokasiAkad?: string
  alamatAkad?: string
  tanggalResepsi?: string | Date
  lokasiResepsi?: string

  // Gambar Bersama — maksimal 6 foto, dipakai di Taman Rahasia atau Kisah Pertemuan
  bersamaFotos?: string[]
  bersamaDipakai?: string

  // Love Gift
  noAtm?: string | null
  namaBank?: string | null
  fotoQris?: string | null
  noHp?: string | null
  isGiftActive?: boolean
  isBankActive?: boolean
  isQrisActive?: boolean

  // Relations
  galeryId?: string | null
  galery?: IGalery | null

  pertemuanId?: string | null
  pertemuan?: IPertemuan | null

  comentIds?: string | null
  comments: IComment[]

  // Tabel khusus Pohon Harapan (Template B) — terpisah dari comments
  ucapanHarapan: IUcapanHarapan[]

  createdAt: Date
  updatedAt: Date
}

//////////////////////
// PERTEMUAN
//////////////////////

export interface IPertemuan {
  id: string
  templateWedingId: string
  templateWeding: ITemplateWeding

  judulPertemuanSatu: string
  judulPertemuanDua: string
  judulPertemuanTiga: string
  judulPertemuanEmpat: string

  pertemuanPertama: string
  pertemuanKedua: string
  pertemuanKetiga: string
  pertemuanKeempat: string
}

//////////////////////
// GALERY
//////////////////////

export interface IGalery {
  id: string
  fotos: string[]
  templateWedings: ITemplateWeding[]
}

//////////////////////
// COMMENT
//////////////////////

export interface IComment {
  id: string
  name: string
  presence: boolean
  comment: string
  gif?: string | null
  ip: string
  userAgent: string
  likesCount: number
  parentId?: string | null
  templateWedingId?: string | null

  createdAt: Date
  updatedAt: Date

  templateWeding?: ITemplateWeding | null

  parent?: IComment | null
  replies: IComment[]

  likedBy: ILike[]
}

export interface IUcapanHarapan {
  id: string
  name: string
  ucapan: string
  ip: string
  userAgent: string
  templateWedingId?: string | null

  createdAt: Date
  updatedAt: Date

  templateWeding?: ITemplateWeding | null
}

//////////////////////
// LIKE
//////////////////////

export interface ILike {
  id: string
  commentId: string
  sessionId: string
  createdAt: Date

  comment: IComment
}

//////////////////////
// SESSION
//////////////////////

export interface ISession {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date

  user: IUser
}