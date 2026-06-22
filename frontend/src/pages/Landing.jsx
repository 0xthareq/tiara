import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUpRight,
  GraduationCap,
  Trophy,
  CircleCheck,
} from "lucide-react";
import BoidCanvas from "../components/BoidCanvas.jsx";

const FORM_TRACER_STUDY = "https://forms.gle/PBuwoY52XqUVVyM56";
const FORM_PRESTASI = "https://forms.gle/UQd9HscWiBsFjbdC7";

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper text-ink overflow-x-hidden">
      {/* Ikan-ikan berenang — fixed fullscreen, terlihat di seluruh landing page */}
      <BoidCanvas />

      {/* ============ HERO ============ */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">
        {/* Halus: pola titik ala kertas grafik — nuansa MIPA tanpa berisik */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: "radial-gradient(circle, #E4E1D6 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 60% 50% at 50% 35%, black 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 35%, black 40%, transparent 100%)",
          }}
        />

        {/* Logos */}
        <div className="relative flex items-center gap-3 mb-8">
          <img src="/untan-logo.png" alt="Logo Universitas Tanjungpura" className="h-14 w-14 object-contain" />
          <div className="w-px h-10 bg-line" />
          <img src="/tiara-logo.png" alt="Logo TIARA" className="h-14 w-14 object-contain" />
        </div>

        {/* Badge */}
        <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-greensoft border border-green/20 text-[13px] font-medium text-green mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-green" />
          Sinkronisasi otomatis data yang termutakhirkan
        </div>

        {/* Wordmark — garis "tracer" tipis sebagai signature, melambangkan jejak yang ditelusuri */}
        <div className="relative mb-2">
          <svg
            className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-[120%] max-w-[640px] h-10 text-azure/25"
            viewBox="0 0 600 40"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 30 C 100 5, 200 35, 300 18 S 500 2, 600 22"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="1 9"
              strokeLinecap="round"
            />
          </svg>
          <h1 className="relative font-display font-bold tracking-tight text-[15vw] sm:text-7xl md:text-8xl leading-none bg-gradient-to-br from-ink via-azure to-azuredeep bg-clip-text text-transparent">
            T i Λ R Λ
          </h1>
        </div>

        {/* Tagline */}
        <p className="relative font-serif italic text-xl sm:text-2xl text-inksoft mt-5 mb-4">
          {/* <b>T</b>racer <b>I</b>nformation &middot; and &middot; <b>A</b>chievement <b>R</b>ecord <b>A</b>pplication */}
          <b>T</b>racer Study &middot; <b>I</b>nformasi <b>A</b>lumni &middot; P<b>r</b>estasi Mahasisw<b>a</b>
        </p>

        {/* Subtitle */}
        <p className="relative max-w-md text-[15px] text-inkfaint leading-relaxed mb-10">
          Platform monitoring terpadu untuk lulusan, keterserapan kerja, dan
          pencapaian mahasiswa FMIPA Universitas Tanjungpura.
        </p>

        {/* CTAs */}
        <div className="relative flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-azure text-white text-sm font-semibold shadow-card hover:bg-azuredeep transition-colors"
          >
            Lihat Dashboard
            <ArrowUpRight size={16} strokeWidth={2.2} />
          </Link>
          <a
            href="#isi-form"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-line bg-surface text-ink text-sm font-semibold hover:border-azure hover:text-azure transition-colors"
          >
            Isi Form
            <ArrowDown size={16} strokeWidth={2.2} />
          </a>
        </div>
      </section>

      {/* ============ PILIH FORM ============ */}
      <section id="isi-form" className="px-6 pb-24 -mt-8 sm:-mt-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink mb-2">
              Pilih form sesuai status kamu
            </h2>
            <p className="text-sm text-inkfaint">
              Form dibuka di Google Forms - masuk dengan akun Google kamu untuk mengisi.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Card: Alumni */}
            <div className="bg-surface rounded-2xl border border-line shadow-card p-6 flex flex-col">
              <div className="w-11 h-11 rounded-xl bg-azuresoft flex items-center justify-center mb-4">
                <GraduationCap size={22} className="text-azure" strokeWidth={1.8} />
              </div>
              <h3 className="font-display font-bold text-ink text-lg mb-1.5">
                Alumni
              </h3>
              <p className="text-sm text-inksoft leading-relaxed mb-5 flex-1">
                Sudah lulus dari FMIPA? Ceritakan kelulusan dan perjalanan
                kariermu lewat Tracer Study Alumni.
              </p>
              <ul className="space-y-1.5 mb-6">
                {["Data kelulusan", "Status karier saat ini", "Bukti pendukung (opsional)"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[13px] text-inkfaint">
                    <CircleCheck size={14} className="text-green shrink-0" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={FORM_TRACER_STUDY}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-ink text-white text-sm font-semibold hover:bg-azuredeep transition-colors"
              >
                Isi Tracer Study Alumni
                <ArrowUpRight size={15} strokeWidth={2.2} />
              </a>
            </div>

            {/* Card: Mahasiswa Aktif */}
            <div className="bg-surface rounded-2xl border border-line shadow-card p-6 flex flex-col">
              <div className="w-11 h-11 rounded-xl bg-ambersoft flex items-center justify-center mb-4">
                <Trophy size={22} className="text-amber" strokeWidth={1.8} />
              </div>
              <h3 className="font-display font-bold text-ink text-lg mb-1.5">
                Mahasiswa Aktif
              </h3>
              <p className="text-sm text-inksoft leading-relaxed mb-5 flex-1">
                Punya prestasi lomba atau ikut kegiatan di luar kampus
                (MBKM)? Laporkan lewat form ini.
              </p>
              <ul className="space-y-1.5 mb-6">
                {["Prestasi lomba / kompetisi", "Kegiatan MBKM di luar kampus", "Boleh diisi berkali-kali"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[13px] text-inkfaint">
                    <CircleCheck size={14} className="text-green shrink-0" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={FORM_PRESTASI}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-ink text-white text-sm font-semibold hover:bg-azuredeep transition-colors"
              >
                Isi Prestasi &amp; Kegiatan
                <ArrowUpRight size={15} strokeWidth={2.2} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="px-6 py-8 border-t border-line text-center">
        <p className="text-[12px] text-inkfaint leading-relaxed">
          Akademik & Kemahasiswaan FMIPA Universitas Tanjungpura &middot; 2026
          <br />
          Universitas Tanjungpura
        </p>
      </footer>
    </div>
  );
}
