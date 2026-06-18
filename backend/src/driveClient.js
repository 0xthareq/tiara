/**
 * Respon "unggah file" dari Google Form otomatis tersimpan ke Google Drive,
 * dan tautannya otomatis dicatat oleh Form di kolom terkait pada Google Sheet
 * (biasanya berbentuk "https://drive.google.com/open?id=FILE_ID").
 * Fungsi-fungsi ini hanya menormalkan tautan tersebut agar pasti bisa dibuka.
 */

export function extractDriveFileId(rawLink) {
  if (!rawLink) return null;
  const idMatch = rawLink.match(/[-\w]{25,}/);
  return idMatch ? idMatch[0] : null;
}

export function toViewableDriveLink(rawLink) {
  const fileId = extractDriveFileId(rawLink);
  if (!fileId) return rawLink || null;
  return `https://drive.google.com/file/d/${fileId}/view`;
}
