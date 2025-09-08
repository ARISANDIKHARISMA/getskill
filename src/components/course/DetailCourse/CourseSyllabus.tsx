import { useState } from "react";
import { ChevronDown, ChevronUp, Trophy, BookOpen } from "lucide-react";
import type { DetailCourse, Module, SubModule, Quiz } from "../../../features/course/_course";

interface CourseSyllabusProps {
  courseData: DetailCourse;
}

export default function CourseSyllabus({ courseData }: CourseSyllabusProps) {
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(null);

  // Toggle buka/tutup modul
  const handleToggle = (index: number) => {
    setOpenModuleIndex(openModuleIndex === index ? null : index);
  };

  // Render daftar sub-modul
  const renderSubModules = (subModules: SubModule[]) => (
    subModules.map((subModule: SubModule, i: number) => (
      <li
        key={`sub-${i}`}
        className="flex items-center gap-3 pl-4 pr-4 py-3 border-b border-gray-200 last:border-b-0 group bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
      >
        <BookOpen size={14} className="text-purple-600" />
        <span className="flex-1 text-left">{subModule.title}</span>
      </li>

    ))
  );

  // Render daftar quiz
  const renderQuizzes = (quizzes: Quiz[]) => (
    quizzes.map((quiz: Quiz, i: number) => (
      <li
        key={`quiz-${i}`}
        className="relative flex items-start pl-9 pr-4 py-3 border-b border-gray-200 last:border-b-0 group bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
      >
        <span className="absolute left-4 top-4 text-yellow-500">
          Quiz</span>
        <span className="flex-1 text-right text-yellow-500">
          {quiz.total_question} Soal
        </span>
      </li>
    ))
  );

  return (
    <section className="space-y-5 font-sans">
      {courseData.modules?.map((module: Module, index: number) => {
        const isOpen = openModuleIndex === index;

        return (
          <div
            key={index}
            className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-sm"
          >
            {/* === Header Modul === */}
            <div
              className="flex items-start justify-between p-5 cursor-pointer"
              onClick={() => handleToggle(index)}
            >
              <div className="flex gap-4 w-full">
                {/* Nomor bulat */}
                <div className="bg-yellow-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>

                {/* Judul */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-black text-lg text-left">
                      {module.title}
                    </h3>
                    <button className="text-gray-500">
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  {/* Metadata: jumlah sub-modul, kuis, task */}
                  <div className="flex flex-wrap gap-5 mt-2 text-sm text-gray-500">
                    {module.sub_module_count > 0 && (
                      <span className="flex items-center gap-1">
                        <BookOpen size={12} className="text-purple-500" />
                        {module.sub_module_count} Modul
                      </span>
                    )}
                    {module.quizz_count > 0 && (
                      <span className="flex items-center gap-1">
                        <Trophy size={12} className="text-yellow-500" />
                        {module.quizz_count} Kuis
                      </span>
                    )}
                    {module.module_task_count > 0 && (
                      <span className="flex items-center gap-1">
                        📝 {module.module_task_count} Tugas
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* === Konten Modul Expand === */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[600px] pb-4 px-5" : "max-h-0"
                }`}
            >
              <ul className="mt-3 border border-gray-300 rounded-lg overflow-hidden text-[13px] text-gray-600">
                {module.sub_modules && renderSubModules(module.sub_modules)}
                {module.quizzes && renderQuizzes(module.quizzes)}
              </ul>
            </div>
          </div>
        );
      })}
    </section>
  );
}
