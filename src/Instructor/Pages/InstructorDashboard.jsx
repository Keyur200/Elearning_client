import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpenIcon, ChartBarIcon, CurrencyDollarIcon, UserGroupIcon, 
  AcademicCapIcon, ChatBubbleBottomCenterTextIcon, StarIcon, PresentationChartLineIcon 
} from '@heroicons/react/24/outline';

// Hardcoded current instructor ID for simulation (Replace with dynamic context/prop)
const CURRENT_INSTRUCTOR_ID = "instructor-456"; 
const API_BASE_URL = 'http://localhost:5000/api'; 

// --- API Simulation/Fetch Functions ---

const fetchInstructorData = async (instructorId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800)); 

  // --- REAL API IMPLEMENTATION (Uncomment and replace dummy data when backend is ready) ---
  /* try {
    // Example fetches based on the models provided (Course, Enrollment, VideoReview, Payment, CourseRating, Profile)
    const [statsRes, coursesRes, progressRes] = await Promise.all([
      fetch(`${API_BASE_URL}/instructors/${instructorId}/stats`), // Combined stats endpoint
      fetch(`${API_BASE_URL}/courses?instructorId=${instructorId}&limit=2`), // Recent courses
      fetch(`${API_BASE_URL}/enrollments/recent?instructorId=${instructorId}&limit=3`), // Recent student progress
    ]);

    const statsData = await statsRes.json();
    const coursesData = await coursesRes.json();
    const progressData = await progressRes.json();
    
    return {
      instructorName: statsData.profile.fullName || 'Instructor', // ProfileModel
      totalCourses: statsData.courseCount, // CourseModel
      totalEnrollments: statsData.enrollmentCount, // EnrollmentModel
      monthlyRevenue: statsData.monthlyRevenue || 0, // PaymentModel
      averageRating: statsData.averageRating || 0, // CourseRatingModel
      unansweredQuestions: statsData.unansweredQuestionsCount || 0, // VideoReviewModel
      engagementScore: statsData.engagementScore || 0, // Derived from EnrollmentModel progress
      recentCourses: coursesData.map(c => ({
          id: c._id, 
          title: c.title, 
          enrollments: c.enrollmentCount, 
          rating: c.avgRating, 
          status: c.isPublished ? "Published" : "Draft"
      })),
      studentProgress: progressData.map(p => ({
          id: p._id, 
          name: p.user.fullName || p.userId, // ProfileModel lookup
          course: p.course.title, 
          progress: p.progress, 
          isComplete: p.isComplete
      }))
    };
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw new Error('Failed to fetch data from the server.');
  }
  */

  // --- DUMMY DATA (Active) ---
  return {
    instructorName: "Dr. Alex Sharma", 
    totalCourses: 5,
    totalEnrollments: 4500,
    monthlyRevenue: 12500, 
    averageRating: 4.6, 
    unansweredQuestions: 15, 
    engagementScore: 82, 
    recentCourses: [ 
      { id: 101, title: "Modern React with Hooks", enrollments: 120, rating: 4.7, status: "Published" },
      { id: 102, title: "Advanced Node.js API Design", enrollments: 85, rating: 4.5, status: "Published" },
    ],
    studentProgress: [ 
      { id: 201, name: "Student 1", course: "Modern React with Hooks", progress: 85, isComplete: false },
      { id: 202, name: "Student 2", course: "Advanced Node.js API Design", progress: 100, isComplete: true },
      { id: 203, name: "Student 3", course: "Modern React with Hooks", progress: 30, isComplete: false },
    ]
  };
};

// --- UTILITY HOOK & COMPONENTS ---

const useFetchData = (fetchFn, dependency) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDataMemoized = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchFn(dependency)
      .then(setData)
      .catch(e => {
        console.error("Fetch failed:", e);
        setError(e);
      })
      .finally(() => setLoading(false));
  }, [fetchFn, dependency]);

  useEffect(() => {
    fetchDataMemoized();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, refetch: fetchDataMemoized };
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
    <p className="ml-3 text-teal-600 font-medium">Loading Instructor Data...</p>
  </div>
);

const ChartPlaceholder = ({ title, description, colorClass, icon: Icon, height = 'h-64' }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl border border-gray-100 ${height}`}>
    <div className={`flex items-center mb-4 ${colorClass}`}>
      <Icon className="w-6 h-6 mr-2" />
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    </div>
    <div className={`text-sm italic text-gray-400 mb-2`}>{description}</div>
    <div className={`${height} w-full ${colorClass.replace('text-', 'bg-')}/10 rounded-xl flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.01]`}>
      <p className={`${colorClass.replace('text-', 'text-')} font-medium text-center`}>Interactive Chart Area</p>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, title, value, unit, color }) => (
  <div className={`bg-white p-5 rounded-2xl shadow-lg flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer border-t-4 ${color.replace('bg-', 'border-')}-600`}>
    <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}-600/80`} />
    </div>
    <p className="text-3xl font-extrabold text-gray-900 mt-2">
      {unit === 'Rating' ? <StarIcon className="w-5 h-5 inline text-yellow-500 mr-1" /> : null}
      {value !== null && value !== undefined ? value.toLocaleString() : '---'}
      <span className="text-lg font-normal ml-1 text-gray-600">{unit}</span>
    </p>
  </div>
);


// --- INSTRUCTOR DASHBOARD COMPONENT ---
const InstructorDashboard = () => {
  const { data, loading, error } = useFetchData(fetchInstructorData, CURRENT_INSTRUCTOR_ID);

  // Default values while loading or on error
  const instructorData = data || {
    instructorName: "Instructor", totalCourses: 0, totalEnrollments: 0, monthlyRevenue: 0, 
    averageRating: 0, unansweredQuestions: 0, engagementScore: 0, recentCourses: [], studentProgress: []
  };

  if (error) return <div className="p-8 text-center text-red-600 bg-red-50">Error loading data. Please check console for details.</div>;

  const { instructorName, totalCourses, totalEnrollments, monthlyRevenue, averageRating, unansweredQuestions, engagementScore, recentCourses, studentProgress } = instructorData;

  const engagementColor = engagementScore > 80 ? 'bg-green-100' : engagementScore > 60 ? 'bg-yellow-100' : 'bg-red-100';
  const engagementTextColor = engagementScore > 80 ? 'text-green-700' : engagementScore > 60 ? 'text-yellow-700' : 'text-red-700';


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">👋 Hello, {instructorName}</h1>
          <p className="text-md sm:text-lg text-gray-600">Your hub for course performance and student engagement. (Models: Course, Enrollment, VideoReview, Payment, CourseRating)</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-teal-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-teal-700 transition-colors transform hover:translate-y-[-1px]">
          Create New Course
        </button>
      </header>
      
      {/* 1. Key Performance Indicators */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        <StatCard icon={BookOpenIcon} title="Courses" value={totalCourses} unit="" color="bg-teal-50" />
        <StatCard icon={UserGroupIcon} title="Total Enrollments" value={totalEnrollments} unit="" color="bg-blue-50" />
        <StatCard icon={CurrencyDollarIcon} title="Monthly Earnings" value={monthlyRevenue} unit="₹" color="bg-green-50" />
        <StatCard icon={StarIcon} title="Avg. Rating" value={averageRating} unit="Rating" color="bg-yellow-50" />
        <StatCard icon={ChatBubbleBottomCenterTextIcon} title="Unanswered Q&A" value={unansweredQuestions} unit="" color="bg-red-50" />
      </section>

      {loading && <LoadingSpinner />}

      {!loading && (
        <>
        {/* 2. Charts & Engagement */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Enrollment Chart - Takes 2/4 (EnrollmentModel) */}
          <div className="lg:col-span-2">
            <ChartPlaceholder 
              title="Course Enrollment Breakdown" 
              description="Enrollment count per course (EnrollmentModel, CourseModel)" 
              colorClass="text-blue-600"
              icon={ChartBarIcon}
              height="h-[400px]"
            />
          </div>

          {/* Engagement Score Card - Takes 1/4 (EnrollmentModel) */}
          <div className={`lg:col-span-1 p-6 rounded-2xl shadow-xl flex flex-col justify-between ${engagementColor} border border-gray-100`}>
            <h3 className={`text-xl font-bold mb-4 flex items-center ${engagementTextColor}`}>
              <AcademicCapIcon className={`w-6 h-6 mr-2 ${engagementTextColor}`} />
              Engagement Score
            </h3>
            <p className={`text-6xl font-extrabold ${engagementTextColor} flex items-center`}>
              {engagementScore}%
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Based on completion rates and student activity (EnrollmentModel).
            </p>
            <button className={`mt-4 w-full px-4 py-2 rounded-xl text-white font-medium shadow-md ${engagementColor.includes('green') ? 'bg-green-600 hover:bg-green-700' : engagementColor.includes('yellow') ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-red-600 hover:bg-red-700'} transition-colors`}>
              Improve Strategy
            </button>
          </div>

          {/* Revenue Chart - Takes 1/4 (PaymentModel) */}
          <div className="lg:col-span-1">
            <ChartPlaceholder 
              title="Revenue Trend" 
              description="Last 6 months revenue performance (PaymentModel)" 
              colorClass="text-green-600"
              icon={CurrencyDollarIcon}
              height="h-[400px]"
            />
          </div>
        </section>

        {/* 3. Student Progress & Course Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          
          {/* Recent Course Activity (CourseModel) */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center text-teal-700">
              <PresentationChartLineIcon className="w-5 h-5 mr-2" />
              Your Active Courses ({recentCourses.length})
            </h2>
            <div className="space-y-4">
              {recentCourses.length > 0 ? recentCourses.map(course => (
                <div key={course.id} className="p-4 border border-gray-200 rounded-xl hover:bg-teal-50 transition-shadow cursor-pointer">
                  <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          course.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                          {course.status}
                      </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1 flex justify-between">
                      <span>{course.enrollments.toLocaleString()} Enrollments</span>
                      <span className="text-yellow-500 font-bold">{course.rating} ⭐</span>
                  </p>
                  <button className="mt-3 text-teal-600 hover:text-teal-800 font-medium text-sm">
                    Manage Content &rarr;
                  </button>
                </div>
              )) : <p className="text-gray-500 italic">No courses published yet.</p>}
            </div>
          </div>
          
          {/* Student Progress Monitoring (EnrollmentModel) */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center text-purple-700">
              <UserGroupIcon className="w-5 h-5 mr-2" />
              Student Progress Monitoring
            </h2>
            <div className="space-y-4">
                {studentProgress.length > 0 ? studentProgress.map((student) => (
                <div key={student.id} className="p-4 border border-gray-200 rounded-xl hover:bg-purple-50 transition-colors">
                    <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-600 mb-2">{student.course} <span className="text-purple-500 font-medium">(Enrollment Link)</span></p>
                    <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full transition-all duration-500 ${student.isComplete ? 'bg-green-500' : 'bg-purple-500'}`} 
                              style={{ width: `${student.progress}%` }}
                            ></div>
                        </div>
                        <span className={`w-12 text-sm font-semibold ml-3 ${student.isComplete ? 'text-green-600' : 'text-purple-600'}`}>
                            {student.isComplete ? 'Done' : `${student.progress}%`}
                        </span>
                    </div>
                </div>
                )) : <p className="text-gray-500 italic">No recent student progress to display.</p>}
            </div>
          </div>
        </section>

        {/* 4. Action Focus */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center text-red-700">
              <ChatBubbleBottomCenterTextIcon className="w-5 h-5 mr-2" />
              Urgent: Unanswered Q&A ({unansweredQuestions})
            </h2>
            <p className="text-3xl font-extrabold text-red-600 mb-4">{unansweredQuestions}</p>
            <p className="text-gray-600 mb-4">
              Address student questions in video reviews (VideoReviewModel) promptly.
            </p>
            <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-red-700 transition-colors">
              Go to Q&A Center
            </button>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 bg-yellow-50">
            <h2 className="text-xl font-bold mb-4 flex items-center text-yellow-700">
              <StarIcon className="w-5 h-5 mr-2" />
              Review Management (Avg. {averageRating})
            </h2>
            <p className="text-3xl font-extrabold text-yellow-600 mb-4">{averageRating} Average</p>
            <p className="text-gray-600 mb-4">
              Monitor and respond to course reviews (CourseRatingModel) to build community.
            </p>
            <button className="bg-yellow-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-yellow-700 transition-colors">
              View All Reviews
            </button>
          </div>
        </section>
        </>
      )}
    </div>
  );
};

export default InstructorDashboard;