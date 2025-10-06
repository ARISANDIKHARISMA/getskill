// ========================
// USER COURSE ACTIVITIES
// ========================

export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  point: number;
  phone_number: string;
  gender: string;
  address: string;
  photo: string | null;
  created_at: string;
  updated_at: string;
  banner: string | null;
}

// Sub Category Type
export interface SubCategory {
  id: number;
  category_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// Course Owner Type
export interface CourseOwner {
  id: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  point: number;
  phone_number: string;
  gender: string;
  address: string;
  photo: string | null;
  created_at: string;
  updated_at: string;
  banner: string | null;
}

// Course Type
export interface Course {
  id: string;
  module_count: number;
  module_task_count: number;
  sub_category: SubCategory;
  title: string;
  sub_title: string;
  description: string;
  is_premium: number;
  price: number;
  promotional_price: number | null;
  slug: string;
  photo: string;
  user: CourseOwner;
  is_ready: number;
  ratings?: number[];
  rating: number;
  status: string;
  step: number | null;
  course_test_id: string;
}

// Sub Module Type
export interface SubModule {
  id: string;
  module_id: string;
  step: number;
  title: string;
  slug: string;
  sub_title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// UserCourseActivity Type
export interface UserCourseActivity {
  user: User;
  course: Course;
  total_module: number;
  total_user: number;
  study_time: string;
  study_percentage: number;
  sub_module: SubModule;
  has_post_test:  number | boolean;
  has_pre_test: number | boolean;
  sub_module_slug: string;
  unsubmitted_tasks: number;
  graded_tasks: number;
  ungraded_tasks: number;
  total_sub_module: number;
  completed_sub_modules: number;
  sub_module_step: number;
  max_sub_module_step: number;
  total_quiz: number;
  completed_quizzes: number;
  _debug_has_post_test_raw: number;
  _debug_has_post_test_type: string;
}

// Meta Type
export interface Meta {
  code: number;
  status: string;
  message: string;
}

// API Response Type
export interface UserCourseActivitiesResponse {
  meta: Meta;
  data: UserCourseActivity[];
}
// ========================
// COURSE POST TEST (Final Audit / Tugas Akhir Modul)
// ========================
export interface CoursePostTestQuestion {
  id: string;
  question: string;
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
    user: CourseOwner;
    sub_category: string;
    category: string;
    rating: string;
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
// QUIZ TYPES
// ========================

// Riwayat kuis user
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

// Respons utama quiz (satu data)
export interface QuizType {
  id: string;
  module_id: string;
  sub_module_slug_prev: string | null;
  sub_module_slug_next: string | null;
  course_slug: string;
  course_title: string;
  module_title: string;
  rules: string;
  module_slug: string;
  total_question: number;
  minimum_score: number;
  duration: number;
  retry_delay: number;
  user_latest_quiz: UserQuizHistory | null;
  user_quiz_me: UserQuizHistory | null;
  user_quizzes: UserQuizHistory | UserQuizHistory[] | null; // bisa object tunggal atau array
  is_submited: boolean | null;
  created_at: string;
  step?: number; // dibuat opsional karena tidak ada di API
}

// Respons API lengkap (opsional tapi disarankan)
export interface QuizResponse {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: QuizType;
  success: boolean;
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
    course: {
      id: string;
      title: string;
      slug: string;
    };
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
// SUBMODULE LIST
// ========================
export interface SubModuleType {
  id: string;
  step: number;
  title: string;
  slug: string;
  sub_title: string;
  module_tasks: ModuleTaskListEntry[];
}
export interface ModuleTaskListEntry {
  id: string;
  point: number;
  is_finish: boolean;
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
  content: string;
  url_youtube: string | null;
  course_id: string;
  course_title: string;
  course_sub_title: string;
  course_sub_category: string;
  last_step: number;
  prev: string | null;
  next: string | null;
}
