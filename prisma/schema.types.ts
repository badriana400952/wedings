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

  // Groom
  template:string
  namaPutra: string
  namaLengkapPutra: string
  namaAyahPutra: string
  namaIbuPutra: string
  instagramPutra: string
  photoPutra: string

  // Bride
  namaPutri: string
  namaLengkapPutri: string
  namaAyahPutri: string
  namaIbuPutri: string
  instagramPutri: string
  photoPutri: string

  // Wedding Info
  tanggalPernikahan: string 
  linkGoogleCalender: string
  alamatPernikahan: string
  jamMulai: string
  jamSelesai: string
  linkMaps: string

  // Love Gift
  noAtm?: string | null
  namaBank?: string | null
  fotoQris?: string | null
  noHp?: string | null

  // Relations
  galeryId?: string | null
  galery?: IGalery | null

  pertemuanId?: string | null
  pertemuan?: IPertemuan | null

  comentIds?: string | null
  comments: IComment[]

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