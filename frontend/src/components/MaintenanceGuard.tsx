/**
 * MaintenanceGuard.tsx
 * ─────────────────────
 * Wrapper komponen yang mengecek env var VITE_MAINTENANCE_MODE.
 * Kalau true → tampilkan MaintenancePage, kalau false → render children normal.
 *
 * CARA PAKAI di App.tsx:
 *   import MaintenanceGuard from "./components/MaintenanceGuard";
 *
 *   function App() {
 *     return (
 *       <MaintenanceGuard>
 *         <Router>
 *           ...routes kamu...
 *         </Router>
 *       </MaintenanceGuard>
 *     );
 *   }
 *
 * Untuk aktifkan maintenance:
 *   Di .env.local → VITE_MAINTENANCE_MODE=true
 *   Di Vercel dashboard → Environment Variables → VITE_MAINTENANCE_MODE = true
 *   (Set ke false atau hapus variabelnya untuk kembali normal)
 */

import MaintenancePage from "./MaintenancePage";

type Props = {
  children: React.ReactNode;
};

export default function MaintenanceGuard({ children }: Props) {
  const isMaintenanceMode =
    import.meta.env.VITE_MAINTENANCE_MODE === "true";

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
}
