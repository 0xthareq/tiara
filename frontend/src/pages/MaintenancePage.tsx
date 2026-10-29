import { useEffect, useRef } from "react";
import styles from "./MaintenancePage.module.css";

/**
 * MaintenancePage - TIARA (Fakultas MIPA Untan)
 * ─────────────────────────────────────────────
 * Diadaptasi dari BSmart Education (Next.js) ke Vite + React.
 * Perubahan dari versi BSmart:
 *   - Hapus "use client" directive (Next.js only)
 *   - Branding → TIARA / Fakultas MIPA Untan
 *   - Warna accent → biru TIARA (#5B8DF5) & violet (#9B6DFF)
 *
 * Urutan animasi SAMA persis seperti BSmart:
 *   1. Kartu depan tilt (rotateY -30deg) setelah delay 1s
 *   2. Tilt selesai → semua kartu "explode" (fan out)
 *   3. Explode selesai → tiap kartu "mengetik" baris kode random
 *      (baris terakhir pakai warna accent TIARA)
 *   4. 2 detik setelah baris terakhir → semua kartu "glitch" infinite
 *   5. Hover = naik; klik = kartu terbang + fade
 *
 * CARA PAKAI:
 *   Taruh di src/pages/MaintenancePage.tsx (satu folder dengan .module.css).
 *   Lalu tambahkan routing di App.tsx (lihat catatan di bawah).
 */

type MaintenancePageProps = {
  title?: string;
  subtitle?: string;
  description?: React.ReactNode;
  errorCode?: string;
  year?: number;
};

const PERSPEC_CONFIG = [
  { spreaddist: "125px", scaledist: "0.75", vertdist: "-25px" },
  { spreaddist: "100px", scaledist: "0.8",  vertdist: "-20px" },
  { spreaddist: "75px",  scaledist: "0.85", vertdist: "-15px" },
  { spreaddist: "50px",  scaledist: "0.9",  vertdist: "-10px" },
  { spreaddist: "25px",  scaledist: "0.95", vertdist: "-5px"  },
  { spreaddist: "0px",   scaledist: "1",    vertdist: "0px"   },
];

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function MaintenancePage({
  title = "Sedang Dalam Pemeliharaan",
  subtitle = "503",
  description = (
    <>
      Platform FMIPA dalam angka sedang dalam pemeliharaan. Mohon maaf atas ketidaknyamanannya.
      Info lebih lanjut silahkan hubungi{" "}
      <a
        href="https://wa.me/6285787908406?text=Halo%2C%20saya%20mau%20tanya%20soal%20BSmart%20Education"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        Hubungi Kami
      </a>.
    </>
  ),
  errorCode = "ERR_MAINTENANCE_MODE",
  year = new Date().getFullYear(),
}: MaintenancePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const stackContainer = root.querySelector<HTMLDivElement>(
      `.${styles.stackContainer}`
    );
    const cardNodes = Array.from(
      root.querySelectorAll<HTMLDivElement>(".card-container")
    );
    const writingNodes = Array.from(
      root.querySelectorAll<HTMLDivElement>(`.${styles.writing}`)
    );
    const perspecNodes = Array.from(
      root.querySelectorAll<HTMLDivElement>(`.${styles.perspec}`)
    );
    const firstPerspec = perspecNodes[0];
    const firstCard   = root.querySelector<HTMLDivElement>(`.${styles.card}`);

    if (!stackContainer || !firstPerspec || !firstCard) return;

    let counter = cardNodes.length;
    const cleanupFns: Array<() => void> = [];

    // 1) Tilt kartu depan selesai → explode semua kartu
    const handleTiltEnd = () => {
      perspecNodes.forEach((elem) => elem.classList.add(styles.explode));
    };
    firstCard.addEventListener("animationend", handleTiltEnd, { once: true });
    cleanupFns.push(() =>
      firstCard.removeEventListener("animationend", handleTiltEnd)
    );

    // 2) Explode selesai → hover/klik + animasi mengetik
    const handleExplodeEnd = (e: AnimationEvent) => {
      if (e.target !== firstPerspec) return;

      cardNodes.forEach((elem) => {
        elem.classList.add(styles.pokeup);

        // Klik → kartu terbang
        const handleClick = () => {
          const dirs = [800, -800];
          const randomY = dirs[Math.floor(Math.random() * dirs.length)];
          const randomX = Math.floor(Math.random() * 1000) - 1000;
          elem.style.transform = `translate(${randomX}px, ${randomY}px) rotate(-540deg)`;
          elem.style.transition = "transform 1s ease, opacity 2s";
          elem.style.opacity   = "0";
          counter--;
          if (counter === 0) {
            stackContainer.style.width  = "0";
            stackContainer.style.height = "0";
          }
        };
        elem.addEventListener("click", handleClick);
        cleanupFns.push(() => elem.removeEventListener("click", handleClick));

        // Animasi mengetik kode
        const numLines = randomIntFromInterval(5, 10);
        const ul = elem.querySelector<HTMLUListElement>(`.${styles.code} ul`);
        if (!ul) return;

        for (let index = 0; index < numLines; index++) {
          const lineLength = randomIntFromInterval(25, 97);
          const node       = document.createElement("li");
          node.dataset.nodeIndex = String(index);
          node.style.setProperty("--linelength", `${lineLength}%`);
          ul.appendChild(node);

          if (index === 0) {
            node.classList.add(styles.writeLine);
          } else {
            const prevNode = ul.querySelector<HTMLLIElement>(
              `li[data-node-index="${index - 1}"]`
            );
            prevNode?.addEventListener(
              "animationend",
              () => {
                if (index === numLines - 1) {
                  node.classList.add(styles.errorLine);
                  node.classList.add(styles.writeLine);
                  setTimeout(() => {
                    writingNodes.forEach((w) =>
                      w.classList.add(styles.writingError)
                    );
                  }, 2000);
                } else {
                  node.classList.add(styles.writeLine);
                }
              },
              { once: true }
            );
          }
        }
      });
    };

    firstPerspec.addEventListener(
      "animationend",
      handleExplodeEnd as EventListener
    );
    cleanupFns.push(() =>
      firstPerspec.removeEventListener(
        "animationend",
        handleExplodeEnd as EventListener
      )
    );

    return () => cleanupFns.forEach((fn) => fn());
  }, []);

  return (
    <div ref={rootRef} className={styles.container}>
      <div className={styles.error}>
        <h1>{subtitle}</h1>
        <h2>{title.toUpperCase()}</h2>
        <p>{description}</p>
        <p className={styles.subtitle}>{errorCode}</p>
      </div>

      <div className={styles.stackContainer}>
        {PERSPEC_CONFIG.map((cfg, i) => (
          <div className="card-container" key={i}>
            <div
              className={styles.perspec}
              style={
                {
                  "--spreaddist": cfg.spreaddist,
                  "--scaledist":  cfg.scaledist,
                  "--vertdist":   cfg.vertdist,
                } as React.CSSProperties
              }
            >
              <div className={styles.card}>
                <div className={styles.writing}>
                  <div className={styles.topbar}>
                    <div className={styles.red}    />
                    <div className={styles.yellow} />
                    <div className={styles.green}  />
                  </div>
                  <div className={styles.code}>
                    <ul />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <p className={styles.copyright}>
          © {year} TIARA — Fakultas MIPA, Universitas Tanjungpura
        </p>
      </footer>
    </div>
  );
}
