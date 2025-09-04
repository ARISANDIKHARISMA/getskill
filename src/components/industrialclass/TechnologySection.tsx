import React, { useState, useEffect } from "react";
import conceptImg from "../../assets/img/others/concept3.png.png";
import { ArrowRight } from "lucide-react";

const SkeletonTechnology: React.FC = () => {
  return (
    <section className="technology-section py-16 xl:py-20 2xl:py-24">
      <div className="container mx-auto px-4 md:px-6 xl:px-12 2xl:px-16">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16 xl:gap-20 2xl:gap-24">

          {/* Left side - Image Skeleton */}
          <div className="w-full lg:w-5/12 xl:w-4/12 2xl:w-3/12 flex justify-center lg:justify-start relative lg:-ml-6 md:px-6 xl:ml-10 2xl:ml-12">
            <div className="relative bg-gray-200/40 p-4 w-[85%] sm:w-[70%] md:w-[60%] lg:w-auto lg:max-w-[345px] xl:max-w-[355px] 2xl:max-w-[400px] h-[240px] md:h-[300px] lg:h-[340px] xl:h-[380px] 2xl:h-[420px] overflow-hidden">
              <div className="w-full h-full bg-gray-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>

          {/* Right side - Content Skeleton */}
          <div className="w-full lg:w-7/12 xl:w-8/12 2xl:w-9/12 text-left md:pl-4 md:pr-2 lg:pl-12 xl:pl-16 2xl:pl-20 space-y-4">
            <div className="bg-gray-300/50 h-6 w-40 animate-pulse"></div>
            <div className="bg-gray-300/50 h-8 xl:h-9 w-3/4 animate-pulse"></div>
            <div className="bg-gray-200/50 h-6 w-1/2 animate-pulse"></div>

            <div className="space-y-2 mt-4">
              <div className="bg-gray-200/50 h-4 w-full animate-pulse"></div>
              <div className="bg-gray-200/50 h-4 w-5/6 animate-pulse"></div>
              <div className="bg-gray-200/50 h-4 w-2/3 animate-pulse"></div>
            </div>

            <ul className="space-y-3 mt-6">
              {[...Array(4)].map((_, idx) => (
                <li key={idx} className="flex items-center space-x-3">
                  <div className="bg-gray-300/50 w-6 h-6 animate-pulse"></div>
                  <div className="bg-gray-200/50 h-4 w-56 xl:w-64 2xl:w-72 animate-pulse"></div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

const TechnologySection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <SkeletonTechnology />;

  return (
    <section className="technology-section py-16 xl:py-20 2xl:py-24">
      <div className="container mx-auto px-4 md:px-6 xl:px-12 2xl:px-16">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16 xl:gap-20 2xl:gap-24">

          {/* Left side - Image */}
          <div className="w-full lg:w-5/12 xl:w-4/12 2xl:w-3/12 flex justify-center lg:justify-start relative lg:-ml-6 md:px-6 xl:ml-10 2xl:ml-12">
            <div
              className="absolute bg-orange-50 hidden sm:block"
              style={{
                width: "clamp(220px, 40vw, 460px)",
                height: "clamp(140px, 25vw, 300px)",
                borderRadius: "50% 100% 100% 50% / 60% 100% 100% 60%",
                transform: "rotate(-3deg) translateY(30px)",
              }}
            ></div>

            <img
              src={conceptImg}
              alt="Belajar Online"
              className="w-[85%] sm:w-[70%] md:w-[60%] lg:w-auto lg:max-w-[345px] xl:max-w-[355px] 2xl:max-w-[450px] h-auto object-contain relative z-10"
            />
          </div>

          {/* Right side - Content */}
          <div className="w-full lg:w-7/12 xl:w-6/12 2xl:w-7/12 text-left md:pl-4 md:pr-2 lg:pl-15 xl:pl-10 2xl:pl-50">
            <div className="content">
              <span className="inline-block text-[11px] lg:text-xs xl:text-xs 2xl:text-sm font-semibold text-indigo-500 bg-blue-50 px-3 py-1.5 rounded-full mb-3">
                Teknologi
              </span>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-semibold mb-4 leading-snug">
                Kelas Industri menggunakan sistem LMS sendiri
              </h2>

              <p className="text-gray-600 text-sm sm:text-base md:text-sm lg:text-xs xl:text-xs 2xl:text-sm mb-6 leading-relaxed max-w-1xl">
                Menggunakan smart classroom sebagai pendukung dalam meningkatkan
                daya serap dalam proses kegiatan belajar mengajar (KBM).
              </p>

              <ul className="space-y-3">
                {[
                  "Melakukan sinkronisasi kurikulum berbasis industri.",
                  "Menerima guru magang.",
                  "Menerima siswa magang / Praktik Kerja Lapangan (PKL).",
                  "Mengadakan rekruitmen kerja untuk lulusan SMK jurusan rekayasa perangkat lunak.",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="bg-yellow-400 rounded-full p-1.5 mr-3 flex-shrink-0">
                      <ArrowRight size={14} className="text-white" />
                    </span>
                    <span className="font-semibold text-sm sm:text-base lg:text-sm xl:text-sm 2xl:text-sm lg:font-normal">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
