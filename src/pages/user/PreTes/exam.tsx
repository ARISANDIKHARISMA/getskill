import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPreTestId, fetchCourseDetail } from "../../../features/course/_service/course_service";
import type { DataWrapper, CourseData } from "../../../features/course/_course";
import HeaderPretes from "../../../components/course/PreTes/HeaderPretes";
import { motion, AnimatePresence } from "framer-motion";

const Exam = () => {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();

    const [pretest, setPretest] = useState<DataWrapper | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (pretest?.course_test?.duration) {
            // convert menit → detik
            setTimeLeft(pretest.course_test.duration * 60);
        }
    }, [pretest]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        if (!slug) return;

        const loadPreTest = async () => {
            try {
                setLoading(true);

                // 1. Ambil detail course dulu
                const courseDetail = await fetchCourseDetail(slug);

                if (!courseDetail?.course_test_id) {
                    setError("Course test id tidak ditemukan.");
                    return;
                }

                // 2. Ambil pretest pakai id
                const data = await fetchPreTestId(courseDetail.course_test_id);
                setPretest(data);

            } catch (error) {
                console.error("Gagal memuat data ujian:", error);
                setError("Gagal memuat data ujian.");
            } finally {
                setLoading(false);
            }
        };

        loadPreTest();
    }, [slug]);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl font-semibold text-gray-700">Memuat ujian...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl font-semibold text-red-500">{error}</p>
            </div>
        );
    }

    if (!pretest) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl font-semibold text-gray-700">Data ujian tidak ditemukan.</p>
            </div>
        );
    }

    const totalQuestions = pretest.course_test.total_question;
    const answeredCount = currentQuestion + 1;
    const question: CourseData = pretest.data[currentQuestion];

    // handler pilih jawaban
    const handleAnswer = (questionId: string, value: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };


    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <HeaderPretes />

            {/* Main Content */}
            <div className="2xl:max-w-6xl xl:max-w-5xl lg:max-w-4xl md:max-w-2xl sm:max-w-xl max-w-md mx-auto mt-8">
                {/* Card Intro */}
                <div className="relative min-h-5 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow p-6 mb-6 flex justify-between">
                    <div className="text-left px-5 mt-1">
                        <h2 className="text-xl font-bold text-white">
                            {answeredCount} Dikerjakan dari {totalQuestions} soal
                        </h2>
                    </div>
                    <div className="text-left px-5">
                        <p className="text-purple-700 bg-white py-2 px-4 rounded-lg font-semibold">{formatTime(timeLeft)} Sisa waktu</p>
                    </div>
                </div>

                {/* Card Exam */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Kolom kiri (Soal Ujian) */}
                    <div className="md:col-span-3 bg-white rounded-lg shadow p-8">
                        <h2 className="text-gray-800 text-start font-semibold mb-4">
                            {currentQuestion + 1}.{" "}
                            <span dangerouslySetInnerHTML={{ __html: question.question }} />
                        </h2>

                        {/* Opsi Jawaban */}
                        <div className="space-y-5 md-5 px-5">
                            {["option_a", "option_b", "option_c", "option_d", "option_e"].map(
                                (key) => (
                                    <label
                                        key={key}
                                        className="flex items-center space-x-3 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name={`q-${question.id}`}
                                            value={key}
                                            checked={answers[question.id] === key}
                                            onChange={() => handleAnswer(question.id, key)}
                                            className="w-5 h-5 accent-purple-600"
                                        />
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: question[key as keyof CourseData] as string,
                                            }}
                                        />
                                    </label>
                                )
                            )}
                        </div>

                        <div className="border-t-3 border-gray-200 mt-8"></div>

                        {/* Navigasi */}
                        <div className="flex justify-between mt-6 ">
                            <button
                                disabled={currentQuestion === 0}
                                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                            >
                                ← Kembali
                            </button>
                            <button
                                disabled={currentQuestion === totalQuestions - 1}
                                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                            >
                                Selanjutnya →
                            </button>
                        </div>
                    </div>

                    {/* Kolom kanan (Sidebar) */}
                    <div className="bg-white rounded-lg shadow p-8 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg text-start font-semibold text-gray-800 mb-3">Soal Ujian</h3>

                            {/* Nomor soal */}
                            <div className="grid grid-cols-4 gap-2 mb-6">
                                {pretest.data.map((_, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentQuestion(i)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg border-3 font-semibold 
                      ${currentQuestion === i
                                                ? "bg-purple-700 text-white border-purple-700"
                                                : answers[pretest.data[i].id]
                                                    ? "bg-purple-700 border-purple-700 text-white"
                                                    : "text-purple-700 border-purple-700 hover:text-white hover:bg-purple-700"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <div>
                                <p className="text-sm text-start text-gray-600 mb-5">
                                    Anda bisa menyelesaikan ujian ketika waktu ujian sisa 5 menit
                                </p>
                            </div>
                        </div>

                        {/* Tombol selesai ujian */}
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="w-full py-2 rounded-lg text-white bg-yellow-400 shadow-[4px_4px_0px_0px_#0B1367] font-semibold hover:shadow-none active:translate-y-0.5 transition-all duration-200 ease-out">
                            Selesai Pre Tes
                        </button>
                    </div>
                </div>
            </div>

            {/* Konfirmasi */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50"
                    >
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="bg-white rounded-lg shadow-lg p-6 w-96 text-center"
                        >
                            <h2 className="text-lg font-semibold mb-4">Konfirmasi</h2>
                            <p className="mb-6">Apakah kamu yakin ingin menyelesaikan pre tes?</p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                                >
                                    No
                                </button>
                                <button
                                    onClick={() => {
                                        console.log("Jawaban:", answers);
                                        navigate(`/course/pre-tes/exam/results/${slug}`);
                                    }}
                                    className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                                >
                                    Yes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Exam;
