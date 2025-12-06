import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, BookOpen, ChevronDown, Filter } from "lucide-react";
import CourseCard from "../Components/CourseCard";
// Ensure the path to CourseCard is correct based on your folder structure

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  // Fetch Logic
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Using the route you specified
        const { data } = await axios.get("http://localhost:5000/api/courses");

        if (data.courses) {
          const publishedCourses = data.courses.filter(c => c.isPublished === true);

          setCourses(publishedCourses);

          // Dynamically extract unique categories from the fetched data
          const uniqueCategories = [
            "All",
            ...new Set(
              data.courses.map((c) => c.categoryId?.name).filter(Boolean)
            ),
          ];
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filtering Logic
  const filteredCourses = courses.filter((course) => {
    const categoryName = course.categoryId?.name || "Uncategorized";
    const matchesCategory =
      selectedCategory === "All" || categoryName === selectedCategory;
    const matchesSearch =
      (course.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (course.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Hero / Filter Header */}
      <div className="bg-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Our Courses
          </h1>
          <p className="text-indigo-200 max-w-2xl text-lg mb-8">
            Discover the best online courses. Filter by category or search to
            find your perfect match.
          </p>

          {/* Search Bar (Mobile/Desktop) */}
          <div className="mb-6 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-slate-900 bg-white border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 placeholder-slate-400 transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-white text-indigo-900 shadow-lg scale-105"
                    : "bg-indigo-800/50 text-indigo-200 hover:bg-indigo-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-grow">
        {/* Results Meta */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-slate-800">
            {selectedCategory === "All"
              ? "All Courses"
              : `${selectedCategory} Courses`}
            <span className="ml-3 text-sm font-normal text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
              {filteredCourses.length} results
            </span>
          </h2>

          {/* Sort Dropdown (Visual only for now) */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
            <span>Sort by:</span>
            <button className="flex items-center gap-1 font-semibold text-slate-700 hover:text-indigo-600">
              Newest <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-10 bg-red-50 text-red-600 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* Course Grid */}
        {!loading && !error && filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="text-center py-20">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                No courses found
              </h3>
              <p className="text-slate-500">
                Try adjusting your filters or search query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-6 text-indigo-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default Courses;
