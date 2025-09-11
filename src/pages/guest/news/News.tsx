import React, { useState, useEffect } from "react";
import BackgroundShapes from "../../../components/public/BackgroundShapes";
import NewsCard from "../../../components/public/CardNews/NewsCard";
import { fetchNews } from "../../../features/news/services/news_service";
import type { News } from "../../../features/news/news";

const SkeletonSearchFilterSort: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-3 justify-center items-center mt-6 p-4 md:p-0">
      {/* Search Skeleton */}
      <div className="relative w-full sm:w-80 md:w-90">
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm h-10 flex items-center px-3 animate-pulse">
          <div className="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
          <div className="flex-1 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Filter Skeleton */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm h-10 w-full sm:w-40 flex items-center px-3 animate-pulse">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>

      {/* Sort Skeleton */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm h-10 w-full sm:w-32 flex items-center px-3 animate-pulse">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

// Skeleton News Card
const SkeletonNewsCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 animate-pulse">
      <div className="bg-gray-200 h-40 w-full rounded-md mb-4"></div>
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-gray-200 h-5 w-5 rounded-full"></div>
        <div className="bg-gray-200 h-4 w-24 rounded"></div>
      </div>
      <div className="bg-gray-200 h-5 w-3/4 rounded mb-2"></div>
      <div className="bg-gray-200 h-4 w-full rounded"></div>
      <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
    </div>
  );
};

const News: React.FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortOrder, setSortOrder] = useState("Terbaru");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 8;
  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoading(true);
        const data = await fetchNews();
        setNewsList(data);
      } catch (error) {
        console.error("Gagal memuat berita:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadNews();
  }, []);

  // News filter
  const categories = ["Semua", ...new Set(newsList.map((item) => item.slug.split("-")[0]))];
  const filteredArticles = newsList
    .filter((article) => {
      const matchSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === "Semua" || article.slug.includes(selectedCategory.toLowerCase());
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created);
      const dateB = new Date(b.created);
      return sortOrder === "Terbaru"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative px-6 py-11 bg-gradient-to-r from-indigo-100 via-stone-100 to-fuchsia-100 overflow-hidden">
        <BackgroundShapes />
        <div className="max-w-6xl mx-auto px-4 2xl:px-2 xl:px-18 lg:px-35 md:px-30 sm:px-30 text-left relative z-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Berita
          </h1>
          <p className="mt-2 text-sm sm:text-xs text-gray-800">
            <a href="/">Beranda</a>
            <span className="mx-1">&gt;</span>
            <span className="text-purple-600">Berita</span>
          </p>
        </div>
      </div>

      {/* Search, Filter, Sort */}
      {isLoading ? (
        <SkeletonSearchFilterSort />
      ) : (
        <div className="flex flex-wrap gap-3 justify-center items-center mt-6 p-4 md:p-0">
          {/* Search */}
          <div className="relative w-full sm:w-80 md:w-90">
            <input
              type="text"
              placeholder="Cari Berita"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-700 placeholder-gray-400"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute right-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
          </div>

          {/* Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700 bg-white"
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700 bg-white"
          >
            <option value="Terbaru">Terbaru</option>
            <option value="Terlama">Terlama</option>
          </select>
        </div>
      )}

      {/* Content */}
      <section className="py-10 bg-white rounded-lg">
        <div className="container mx-auto px-5 md:px-20 lg:px-3 xl:px-22 2xl:px-35 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              [...Array(itemsPerPage)].map((_, index) => <SkeletonNewsCard key={index} />)
            ) : paginatedArticles.length > 0 ? (
              paginatedArticles.map((article) => (
                <NewsCard key={article.id} news={article} />
              ))
            ) : (
              <p className="col-span-full text-gray-500">Tidak ada berita yang cocok.</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-20">
            <div className="flex gap-3 mb-10">
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transform transition-all duration-300 ease-in-out
                      ${page === currentPage
                        ? "bg-purple-600 text-white scale-110 shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-purple-100 hover:scale-105 hover:shadow-md"
                      }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;
