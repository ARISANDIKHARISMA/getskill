// src/pages/FiturUnggulanPage.tsx
import React, { useState, useEffect } from 'react';

// Import gambar-gambar
import iconKomponen5 from '../../assets/landingpage/beranda/komponen5.png';
import iconKomponen6 from '../../assets/landingpage/beranda/komponen6.png';
import iconKomponen7 from '../../assets/landingpage/beranda/komponen7.png';

// Interface untuk data fitur
interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

// Komponen Feature Item dengan animasi hover
const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description, bgColor }) => {
  return (
    <div
      className={`w-full p-5 rounded-xl shadow-md border border-gray-200 transition-all duration-200 ease-in-out flex flex-col items-start ${bgColor} 
      hover:scale-[1.01] hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-300`}
    >
      {/* Icon + Title sebaris rata kiri */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      {/* Description di bawah, rata kiri */}
      <p className="text-gray-600 text-sm text-left">{description}</p>
    </div>
  );
};

// --- Komponen Skeleton Loader ---
const SkeletonFeatures: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="w-full max-w-sm p-5 rounded-xl shadow-lg text-center flex flex-col items-center mx-auto animate-pulse"
        >
          <div className="bg-gray-200 w-12 h-12 rounded-full mb-3"></div>
          <div className="bg-gray-200 h-6 w-3/4 mb-2 rounded"></div>
          <div className="bg-gray-200 h-10 w-full rounded"></div>
        </div>
      ))}
    </div>
  );
};
// --- Akhir Komponen Skeleton Loader ---

// Komponen FiturUnggulanPage
const FiturUnggulanPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasikan loading data selama 2 detik
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <section className="py-[20vh] sm:py-[20vh] md:py-[10vh] bg-white rounded-lg">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 text-center">
          <span className="px-3 py-2 text-[10px] sm:text-xs font-semibold bg-[#F6EEFE] text-[#9425FE] rounded-full">
            Fitur Unggulan
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-6 mb-4">
            Upgrade Kemampuan Anda Bersama Getskill.id
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-10 max-w-2xl mx-auto">
            Belajar dari instruktur terbaik di kelas langsung terlibat, berinteraksi, dan menyelesaikan keraguan
          </p>

          {/* Grid responsif */}
          {isLoading ? (
            <SkeletonFeatures />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureItem
                icon={<img src={iconKomponen5} alt="Mentor Terpercaya" className="w-12 h-12" />}
                title="Mentor Terpercaya"
                description="Mentor Kami ramah dan ahli dalam domain untuk membuat Anda belajar dengan mudah"
                bgColor="bg-purple-100" // light
              />
              <FeatureItem
                icon={<img src={iconKomponen6} alt="Kursus Terbaik" className="w-12 h-12" />}
                title="Kursus Terbaik"
                description="Semua kursus kami dibuat dan untuk membuat Anda menikmati mempelajari hal-hal baru"
                bgColor="bg-blue-100" // light
              />
              <FeatureItem
                icon={<img src={iconKomponen7} alt="Tugas Kompetensi" className="w-12 h-12" />}
                title="Tugas Kompetensi"
                description="Bergabunglah dengan kelas kami dengan alat interaktif dan dukungan keraguan"
                bgColor="bg-orange-100" // light
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FiturUnggulanPage;
