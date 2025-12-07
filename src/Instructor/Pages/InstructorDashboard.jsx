import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { 
  Users, 
  BookOpen, 
  IndianRupee, 
  MoreVertical, 
  Loader,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

const InstructorDashboard = () => {
  const navigate = useNavigate(); // 2. Initialize Navigate hook

  // --- State for API Data ---
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRevenue: 0,
    totalCourses: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [courseRevenue, setCourseRevenue] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, salesRes, revenueRes, studentsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/report/instructor/stats", { withCredentials: true }),
        axios.get("http://localhost:5000/api/report/instructor/daily-sales", { withCredentials: true }),
        axios.get("http://localhost:5000/api/report/instructor/course-revenue", { withCredentials: true }),
        axios.get("http://localhost:5000/api/report/instructor/recent-students", { withCredentials: true })
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (salesRes.data.success) setSalesData(salesRes.data.data);
      if (revenueRes.data.success) setCourseRevenue(revenueRes.data.data);
      if (studentsRes.data.success) setRecentStudents(studentsRes.data.data);

    } catch (err) {
      console.error("Error fetching instructor data:", err);
      setError("Failed to load dashboard data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader className="animate-spin text-indigo-600 mb-2" size={40} />
        <p className="text-gray-500 font-medium">Loading Your Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center p-8 bg-red-50 rounded-xl border border-red-100">
          <p className="text-red-600 font-medium text-lg mb-2">Oops!</p>
          <p className="text-gray-600">{error}</p>
          <button onClick={fetchDashboardData} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of your students, courses, and earnings.</p>
          </div>
          {/* 3. Updated Button with onClick navigate */}
          <button 
            onClick={() => navigate('/instructor/create-course')} 
            className="mt-4 md:mt-0 bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 rounded-lg font-medium shadow-sm transition flex items-center gap-2"
          >
              <BookOpen size={18} />
              Create New Course
          </button>
        </div>

        {/* 1. Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Students Enrolled" 
            value={stats.totalStudents} 
            icon={<Users size={24} className="text-indigo-600" />} 
            bgColor="bg-indigo-100" 
            trend="Total Enrollments"
          />
          <StatCard 
            title="Total Revenue" 
            value={`₹${stats.totalRevenue.toLocaleString()}`} 
            icon={<IndianRupee size={24} className="text-emerald-600" />} 
            bgColor="bg-emerald-100" 
            trend="Lifetime Earnings"
          />
          <StatCard 
            title="My Courses" 
            value={stats.totalCourses} 
            icon={<BookOpen size={24} className="text-blue-600" />} 
            bgColor="bg-blue-100" 
            trend="Published Content"
          />
        </div>

        {/* 2. Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Daily Sales (Last 7 Days)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#6b7280'}} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#6b7280'}} />
                  <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}/>
                  <Bar dataKey="sales" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={40} name="Sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue by Course</h3>
            <div className="h-72 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={courseRevenue} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                    {courseRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. Recent Enrollments Table with Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Recent Student Enrollments</h3>
            <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Enrolled Course</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Progress</th> 
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentStudents.length > 0 ? (
                  recentStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                            {student.studentName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{student.studentName}</p>
                            <p className="text-xs text-gray-500">{student.studentEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{student.courseName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-2">
                        <Calendar size={14} />
                        {student.date}
                      </td>
                      {/* 4. Display Progress */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-indigo-600 h-2 rounded-full" 
                                    style={{ width: `${student.progress || 0}%` }}
                                ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-600">{student.progress || 0}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <Users size={32} className="opacity-20" />
                        <p>No recent enrollments found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Component
const StatCard = ({ title, value, icon, bgColor, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition duration-200">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
      <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
        <TrendingUp size={12} />
        {trend}
      </p>
    </div>
    <div className={`p-3 rounded-lg ${bgColor} bg-opacity-80`}>
      {icon}
    </div>
  </div>
);

export default InstructorDashboard;