import axios from "axios";

const client = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

export async function fetchOverview() {
  const { data } = await client.get("/overview");
  return data;
}
export async function fetchTracerStudy() {
  const { data } = await client.get("/tracer-study");
  return data;
}
export async function fetchKarir(tahunPelaporan) {
  const params = tahunPelaporan ? { tahunPelaporan } : {};
  const { data } = await client.get("/karir", { params });
  return data;
}
export async function fetchPrestasi() {
  const { data } = await client.get("/prestasi");
  return data;
}
export async function fetchKegiatan() {
  const { data } = await client.get("/kegiatan");
  return data;
}
