import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Overview from "./pages/Overview.jsx";
import Kelulusan from "./pages/Kelulusan.jsx";
import Karier from "./pages/Karier.jsx";
import Prestasi from "./pages/Prestasi.jsx";
import Kegiatan from "./pages/Kegiatan.jsx";
import Roadmap from "./pages/Roadmap.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/kelulusan" element={<Kelulusan />} />
        <Route path="/karier" element={<Karier />} />
        <Route path="/prestasi" element={<Prestasi />} />
        <Route path="/kegiatan" element={<Kegiatan />} />
        <Route path="/roadmap" element={<Roadmap />} />
      </Route>
    </Routes>
  );
}
