import React, { useState, useEffect, useCallback } from 'react';
import { 
  UsersIcon, BookOpenIcon, ChartBarIcon, CurrencyDollarIcon, 
  ArrowTrendingUpIcon, GlobeAltIcon, UserGroupIcon, BuildingOffice2Icon,
  PresentationChartLineIcon, CheckCircleIcon, XCircleIcon
} from '@heroicons/react/24/outline';

// Hardcoded API endpoint base (Replace with your actual backend URL)
const API_BASE_URL = 'http://localhost:5000/api'; 

// --- API Simulation/Fetch Functions ---

const fetchAdminData = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800)); 

  // --- DUMMY DATA (Active) ---
  return {
    adminName: "Jane Doe", 
    totalUsers: 15400,
    totalInstructors: 250, // New Metric
    totalStudents: 15150, // totalUsers - totalInstructors
    totalCourses: 450,
    publishedCourses: 390, // New Metric
    draftCourses: 60, // New Metric
    totalRevenue: 245800, 
    dailyActiveUsers: 3450,
    totalPayouts: 180500, // New Metric
    latestActivity: [
      { id: 1, type: "New Course", user: "Jane Instructor", detail: "Advanced React Patterns published", time: "2 min ago", color: "text-green-600" },
      { id: 2, type: "Payment Failure", user: "User 5678", detail: "Order #9921 failed processing", time: "1 hour ago", color: "text-red-600" },
      { id: 3, type: "New Instructor", user: "Dr. Ben Smith", detail: "Profile approved for teaching", time: "3 hours ago", color: "text-blue-600" },
      { id: 4, type: "User Banned", user: "Troll Hunter", detail: "User 1234 flagged for spamming", time: "4 hours ago", color: "text-pink-600" },
    ],
    // The moderation queue is kept for the new Content Performance section, but less critical
    moderationQueue: [
      { id: 1, type: "Video", content: "Needs closed captions review.", user: "Course 105", severity: "Medium" },
      { id: 2, type: "Image", content: "Logo misuse detected in thumbnail.", user: "Course 201", severity: "Low" },
    ]
  };
};

// --- UTILITY HOOK & COMPONENTS ---

const useFetchData = (fetchFn) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDataMemoized = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchFn()
      .then(setData)
      .catch(e => {
        console.error("Fetch failed:", e);
        setError(e);
      })
      .finally(() => setLoading(false));
  }, [fetchFn]);

  useEffect(() => {
    fetchDataMemoized();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, refetch: fetchDataMemoized };
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    <p className="ml-3 text-indigo-600 font-medium">Loading Dashboard Data...</p>
  </div>
);

const ChartPlaceholder = ({ title, description, colorClass, icon: Icon, height = 'h-64' }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-xl flex flex-col justify-between transition-all hover:shadow-2xl border border-gray-100 ${height}`}>
    <div>
        <div className={`flex items-center mb-4 ${colorClass}`}>
          <Icon className="w-6 h-6 mr-2" />
          <h3 className="text-xl font-bold text-gray-800 font-semibold">{title}</h3>
        </div>
        <div className={`text-sm italic text-gray-400 mb-2`}>{description}</div>
    </div>
    <div className={`${height === 'h-64' ? 'h-48' : 'h-full'} w-full ${colorClass.replace('text-', 'bg-')}/10 rounded-xl flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.01]`}>
      <p className={`${colorClass.replace('text-', 'text-')} font-medium text-center p-4`}>Interactive Chart Area (e.g., D3/Recharts)</p>
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
      {unit === '₹' && <span className="text-xl font-medium mr-1">₹</span>}
      {value !== null && value !== undefined ? value.toLocaleString() : '---'}
      <span className="text-lg font-normal ml-1 text-gray-600">{unit !== '₹' ? unit : ''}</span>
    </p>
  </div>
);


// --- ADMIN DASHBOARD COMPONENT ---
const AdminDashboard = () => {
  const { data, loading, error } = useFetchData(fetchAdminData);

  const adminData = data || {
    adminName: "Admin", totalUsers: 0, totalInstructors: 0, totalStudents: 0, totalCourses: 0, 
    publishedCourses: 0, draftCourses: 0, totalRevenue: 0, dailyActiveUsers: 0, totalPayouts: 0,
    latestActivity: [], moderationQueue: []
  };

  if (error) return <div className="p-8 text-center text-red-600 bg-red-50">Error loading data. Please check console for details.</div>;

  const { 
    adminName, totalUsers, totalInstructors, totalStudents, totalCourses, 
    publishedCourses, draftCourses, totalRevenue, dailyActiveUsers, totalPayouts, 
    latestActivity, moderationQueue 
  } = adminData;

  const instructorStudentRatio = totalStudents && totalInstructors ? (totalStudents / totalInstructors).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">🚀 Admin Overview, {adminName}</h1>
          <p className="text-md sm:text-lg text-gray-600">Central hub for E-Learning platform performance and management.</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-indigo-700 transition-colors transform hover:translate-y-[-1px]">
          Generate Financial Report
        </button>
      </header>
      
      {loading && <LoadingSpinner />}

      {!loading && (
        <>
        {/* 1. Core Platform Metrics (Simplified) */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Core Financial & User Metrics</h2>
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard icon={UsersIcon} title="Total Users" value={totalUsers} unit="" color="bg-indigo-50" />
          <StatCard icon={GlobeAltIcon} title="Active Daily" value={dailyActiveUsers} unit="" color="bg-blue-50" />
          <StatCard icon={CurrencyDollarIcon} title="Total Revenue" value={totalRevenue} unit="₹" color="bg-yellow-50" />
          <StatCard icon={BuildingOffice2Icon} title="Total Payouts" value={totalPayouts} unit="₹" color="bg-pink-50" />
        </section>
        
        {/* 1. User Account Health (New Section - Focus on Instructor/Student Mix) */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">User Account Health</h2>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <StatCard icon={UserGroupIcon} title="Total Students" value={totalStudents} unit="" color="bg-teal-50" />
            <StatCard icon={UsersIcon} title="Total Instructors" value={totalInstructors} unit="" color="bg-cyan-50" />
            
            {/* Custom Ratio Card */}
            <div className={`bg-white p-5 rounded-2xl shadow-lg flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer border-t-4 border-orange-600`}>
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">Student/Instructor Ratio</p>
                    <UserGroupIcon className="w-6 h-6 text-orange-600/80" />
                </div>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">
                    {instructorStudentRatio}:1
                    <span className="text-lg font-normal ml-1 text-gray-600">ratio</span>
                </p>
            </div>
        </section>

        {/* 2. Charts & Insights */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
          {/* Main Chart */}
          <div className="lg:col-span-3">
            <ChartPlaceholder 
              title="Monthly Enrollment & Revenue Trend" 
              description="Year-over-Year comparison for Q3 performance" 
              colorClass="text-indigo-600"
              icon={ArrowTrendingUpIcon}
              height="h-[400px]"
            />
          </div>
          {/* Category Distribution */}
          <div className="lg:col-span-2">
            <ChartPlaceholder 
              title="Course Category Distribution" 
              description="Breakdown of active courses by top 5 categories" 
              colorClass="text-purple-600"
              icon={ChartBarIcon}
              height="h-[400px]"
            />
          </div>
        </section>

        
       

        {/* 5. Live Activity Feed (Now at the bottom, taking full width for detail) */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Latest Platform Activity</h2>
        <section className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {latestActivity.length > 0 ? latestActivity.map((activity) => (
                <div key={activity.id} className="flex items-start border-l-4 border-gray-200 pl-4 py-3 hover:bg-gray-50 rounded-md transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${activity.color.replace('text-', 'bg-')}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium truncate">{activity.type}: <span className="font-normal text-gray-700">{activity.detail}</span></p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.user} • {activity.time}</p>
                  </div>
                  <button className="text-xs text-indigo-500 hover:text-indigo-700 font-medium ml-4 shrink-0">
                    View
                  </button>
                </div>
              )) : <p className="text-gray-500 italic p-4">No recent activity.</p>}
            </div>
        </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;











 {/* 4'th Seection. Content Performance Overview (New Section - Focus on Course Status) */}
        // <h2 className="text-2xl font-bold text-gray-800 mb-4">Content Performance Overview</h2>
        // <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        //     <StatCard icon={CheckCircleIcon} title="Published Courses" value={publishedCourses} unit="" color="bg-green-50" />
        //     <StatCard icon={XCircleIcon} title="Courses In Draft" value={draftCourses} unit="" color="bg-red-50" />
            
            {/* Content Moderation Status (Re-purposed from old queue) */}
            {/* <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-yellow-600">
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                    <PresentationChartLineIcon className="w-6 h-6 mr-2 text-yellow-600" />
                    Content Moderation Backlog
                </h3>
                <p className="text-3xl font-extrabold text-yellow-600 mb-4">{moderationQueue.length}</p>
                <p className="text-sm text-gray-600">
                    Pending assets or content needing approval/review.
                </p>
                <button className="mt-3 text-sm font-medium text-yellow-600 hover:text-yellow-700">
                    View Moderation Queue &rarr;
                </button>
            </div>
        </section> */}