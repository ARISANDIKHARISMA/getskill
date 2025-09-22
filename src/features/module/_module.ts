// ========================
// COURSE POST TEST (Final Audit / Tugas Akhir Modul)
// ========================
export interface CoursePostTestQuestion {
  id: string;
  question: string; // HTML string
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
}

export interface CoursePostTest {
  id: string;
  duration: number; // menit
  total_question: number;
  is_submitted: number; // 0 / 1
  course: {
    id: string;
    title: string;
    slug: string;
    photo?: string | null;
  };
  courseTestQuestions: {
    id: number;
    module: { id: string; title: string };
    question_count: number;
  }[];
}

export interface CoursePostTestResponse {
  paginate: {
    last_page: number;
    current_page: number;
  };
  data: CoursePostTestQuestion[];
  course_test: CoursePostTest;
  user_quiz?: {
    id: string;
    quiz_questions: string[];
    created_at: string;
  };
}
// ========================
// QUIZ
// ========================
export interface UserQuizHistory {
  id: string;
  user_id: string;
  quiz_id: string;
  module_question_id: string;
  answer: string;
  score: number;
  created_at: string;
  updated_at: string;
}

export interface QuizType {
  id: string;
  module_id: string;
  sub_module_slug_prev: string | null;
  sub_module_slug_next: string | null;
  course_slug: string;
  course_title: string;
  module_title: string;
  rules: string; // HTML
  module_slug: string;
  total_question: number;
  minimum_score: number;
  duration: number;
  retry_delay: number;
  user_latest_quiz: UserQuizHistory | null;
  user_quiz_me?: UserQuizHistory;
  user_quizzes?: UserQuizHistory[];
  is_submited: boolean | null;
  created_at: string;
}


// ========================
// SUBMODULE LIST
// ========================
export interface SubModuleType {
  id: string;
  step: number;
  title: string;
  slug: string;
  sub_title: string;
}

// ========================
// MODULE TASK
// ========================
export interface ModuleTaskType {
  id: string;
  module: {
    id: string;
    course_id: string;
    step: number;
    title: string;
    slug: string;
    sub_title: string;
  };
  question: string;
  description: string;
  point: number;
  total_students: number;
  highest_score: number | null;
  lowest_score: number | null;
  average_score: number | null;
  submission_task: unknown[];
  is_finish: boolean;
  course_photo: string;
}



// ========================
// COURSE SUMMARY
// ========================
export interface CourseSummaryType {
  id: string;
  title: string;
  slug: string;
  course_test_id: string;
}

// ========================
// MODULE
// ========================
export interface ModuleType {
  id: string;
  title: string;
  step: number;
  slug: string;
  sub_title: string;
  course: CourseSummaryType;
  quizzes: QuizType[];
  quiz_count: number;
  module_question_count: number;
  sub_modules: SubModuleType[];
  sub_module_count: number;
  module_tasks: ModuleTaskType[];
  module_task_count: number;
  is_done: boolean | null;
}

// ========================
// EDITOR.JS CONTENT
// ========================
export interface ParagraphBlock {
  id: string;
  type: "paragraph";
  data: { text: string };
}

export interface ListBlock {
  id: string;
  type: "list";
  data: { style: "ordered" | "unordered"; items: string[] };
}

export interface ImageBlock {
  id: string;
  type: "image";
  data: { file: { url: string }; caption?: string };
}

export type ContentBlock = ParagraphBlock | ListBlock | ImageBlock;

export interface ContentType {
  time: number;
  blocks: ContentBlock[];
  version: string;
}

// ========================
// SUBMODULE DETAIL
// ========================
export interface SubModuleDetailType {
  id: string;
  module_id: string;
  course_slug: string;
  module: string;
  step: number;
  title: string;
  slug: string;
  sub_title: string;
  content: string; // JSON string
  url_youtube: string | null;
  course_id: string;
  course_title: string;
  course_sub_title: string;
  course_sub_category: string;
  prev: string | null;
  next: string | null;
}
