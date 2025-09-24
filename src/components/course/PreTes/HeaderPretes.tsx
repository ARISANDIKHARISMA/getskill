import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import { fetchPreTest } from "../../../features/course/_service/course_service";
import type { CourseTest } from "../../../features/course/_course";

const HeaderPretes = () => {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();

    const [pretest, setPretest] = useState<CourseTest | null>(null);

    useEffect(() => {
        if (!slug) return;

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

    return (<div className="flex items-center bg-gradient-to-br from-purple-500 to-purple-700 py-6 px-6 pl-15 2xl:pl-47 xl:pl-47 lg:pl-46 md:pl-32 sm:pl-15 gap-x-3">
        <button
            onClick={() => navigate(-1)}
            className="text-white text-2xl flex items-center justify-center"
        >
            <FiChevronLeft size={24} />
        </button>

        {pretest ? (
            <h1 className="text-white font-semibold text-left">
                Pre Test - {pretest.course?.title ?? "Tanpa Judul"}
            </h1>
        ) : (
            <h1 className="text-white font-semibold text-left">
                Pre Test
            </h1>
        )}
    </div>)
};
export default HeaderPretes;