export const formatTanggalIndo = (dateString: string | Date | null | undefined) => {
  if (!dateString) return "Tanggal tidak tersedia"
  
  const date = dateString instanceof Date ? dateString : new Date(dateString)
  
  // Cek jika date invalid
  if (isNaN(date.getTime())) {
    return "Tanggal tidak valid"
  }

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta", // penting supaya gak geser hari
  }).format(date)
}