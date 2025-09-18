import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPreTest } from "../../../features/course/_service/course_service";
import type { PreTest } from "../../../features/course/_course";


const Tes = () => {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();

    const [pretest, setPretest] = useState<PreTest | null>(null);

    // Fetch data pretest ketika komponen mount
        useEffect(() => {
        if (!slug) return; // pastikan slug ada

        const loadPretest = async () => {
            try {
                const data = await fetchPreTest(slug);
                setPretest(data);
            } catch (error) {
                console.error("Gagal load pretest:", error);
            }
        };

        loadPretest();
    }, [slug]);

    return (
        <div className="min-h-screen bg-gray-100 mb-15">
            {/* Header */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 py-6 px-6">
                {pretest ? (
                <h1 className="text-white font-semibold text-left ml-13 2xl:ml-51 xl:ml-38 lg:ml-23 md:ml-32 sm:ml-15">
                    Pre Test - {pretest.course.title}
                </h1>
                ) : (
                <h1 className="text-white font-semibold text-left ml-13 2xl:ml-51 xl:ml-38 lg:ml-23 md:ml-32 sm:ml-15">
                    Pre Test
                </h1>
                )}
            </div>

            {/* Main Content */}
            <div className="2xl:max-w-6xl xl:max-w-5xl lg:max-w-4xl md:max-w-2xl sm:max-w-xl max-w-md mx-auto mt-8">
                {/* Card Intro */}
                <div className="relative min-h-37 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow p-6 mb-6 flex flex-col md:flex-row items-center md:items-center justify-between">
                    <div className="text-left px-5 mb-4 md:mb-0 md:flex-1">
                        <h2 className="text-2xl font-bold text-white">
                            Test Sebelum Masuk Kursus
                        </h2>
                        <p className="text-white mt-1 sm:text-base md:text-base">
                            Sebelum Memasuki Kursus Anda Diperkenankan Mengerjakan test
                        </p>
                    </div>
                    <div className="flex justify-center md:justify-end w-full md:w-auto">
                        <img
                            src="/src/assets/img/book.png"
                            alt="Ilustrasi Ujian"
                            className="w-80 sm:w-80 md:w-60 mx-8 mt-6 md:mt-0 2xl:absolute xl:absolute lg:absolute 2xl:right-2 2xl:-bottom-0 xl:right-2 xl:-bottom-0 lg:right-2 lg:-bottom-0"
                        />
                    </div>
                </div>

                {/* Card Aturan */}
                <div className="bg-white rounded-lg shadow p-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Aturan</h3>
                    <div className="text-gray-600 space-y-6 text-justify px-4">
                        <p>
                            Anda akan menemui ujian (quiz, exam, atau ujian akhir) seperti ini
                            untuk memastikan Anda sudah mengerti dan memahami materi
                            pembelajaran yang telah diberikan. Pada ujian akan tersedia
                            beberapa pertanyaan dengan opsi jawaban pilihan ganda.
                        </p>
                        <p>
                            Ujian memiliki standar minimum kelulusan. Jika tidak memenuhi nilai
                            minimum, maka Anda wajib mengulang kembali sampai memenuhi standar
                            tersebut. Perhatikan bahwa jika Anda mau mengulang ujian, akan ada
                            waktu tunggu / jeda yang harus lewat. Setelahnya, Anda dapat
                            mengambil kembali ujian yang baru. Waktu tunggu ini berbeda-beda,
                            mulai dari hitungan menit hingga berhari-hari. Jadi agar waktu
                            lebih efisien pastikan Anda sudah siap secara materi, sebelum
                            mengambil ujian.
                        </p>
                        <p>
                            Setiap ujian juga memiliki durasi waktu yang berbeda. Anda wajib
                            menyelesaikan seluruh pertanyaan pada durasi waktu yang telah
                            diberikan. Jika waktu yang diberikan habis, maka ujian akan
                            otomatis selesai. Sistem hanya akan menilai pertanyaan yang sudah
                            terjawab. Jadi, usahakan Anda telah menjawab sebanyak mungkin
                            pertanyaan hingga tuntas, sebelum durasi waktu habis.
                        </p>
                        <p>
                            Mari kita coba fitur ujian pada Getskill. Jika sudah siap
                            mencoba, klik tombol Ambil di bawah. Anda hanya bisa lanjut ke
                            modul pelajaran berikutnya jika telah lulus dari ujian ini.
                        </p>
                    </div>

                    {/* Detail Aturan */}
                    {pretest ? (
                        <ul className="mt-6 text-gray-700 space-y-1 text-left px-5">
                            <li>• Jumlah Soal: {pretest.total_question}</li>
                            <li>• Syarat Nilai Kelulusan: {pretest.course.is_premium ?? 80}</li>
                            <li>• Durasi Ujian: {pretest.duration} Menit</li>
                            <li>• Waktu tunggu ujian ulang: {pretest.is_submitted ?? 1} menit</li>
                        </ul>
                    ) : (
                        <p className="mt-6 text-gray-500 px-5">Memuat data pretest...</p>
                    )}

                    {/* Button */}
                    <div className="text-center mt-8 mb-10">
                        <button
                            onClick={() => {
                                navigate(`/course/pre-tes/exam/${slug}`);
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow">
                            Mulai Ujian
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tes;
