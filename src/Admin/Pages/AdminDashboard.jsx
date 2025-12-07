import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  MoreVertical, 
  IndianRupee,
  Loader,
  TrendingUp 
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

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const AdminDashboard = () => {
  // --- State for API Data ---
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    totalRevenue: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Fetch Data from API ---
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all endpoints in parallel for better performance
      const [statsRes, salesRes, revenueRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/report/stats", { withCredentials: true }),
        axios.get("http://localhost:5000/api/report/daily-sales", { withCredentials: true }),
        axios.get("http://localhost:5000/api/report/category-revenue", { withCredentials: true }),
        axios.get("http://localhost:5000/api/report/recent-users", { withCredentials: true })
      ]);

      // Update State if requests are successful
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (salesRes.data.success) setSalesData(salesRes.data.data);
      if (revenueRes.data.success) setRevenueData(revenueRes.data.data);
      if (usersRes.data.success) setRecentUsers(usersRes.data.data);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader className="animate-spin text-indigo-600 mb-2" size={40} />
        <p className="text-gray-500 font-medium">Loading Dashboard Insights...</p>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center p-8 bg-red-50 rounded-xl border border-red-100">
          <p className="text-red-600 font-medium text-lg mb-2">Oops!</p>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
        
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Dashboard Title - Report Button Removed */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back, Admin. Here is your platform summary.</p>
            </div>
        </div>

        {/* 1. Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Students" 
            value={stats.totalStudents} 
            icon={<Users size={24} className="text-blue-600" />} 
            bgColor="bg-blue-100" 
            trend="Active Learners"
          />
          <StatCard 
            title="Total Instructors" 
            value={stats.totalInstructors} 
            icon={<GraduationCap size={24} className="text-green-600" />} 
            bgColor="bg-green-100" 
            trend="Verified Teachers"
          />
          <StatCard 
            title="Total Courses" 
            value={stats.totalCourses} 
            icon={<BookOpen size={24} className="text-purple-600" />} 
            bgColor="bg-purple-100" 
            trend="Platform Content"
          />
          <StatCard 
            title="Total Revenue" 
            value={`₹${stats.totalRevenue.toLocaleString()}`} 
            icon={<IndianRupee size={24} className="text-yellow-600" />} 
            bgColor="bg-yellow-100" 
            trend="Lifetime Earnings"
          />
        </div>

        {/* 2. Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Bar Chart: Daily Sales */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Daily Sales (Last 7 Days)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#6b7280'}} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#6b7280'}} />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="sales" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Revenue by Category */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue by Category</h3>
            <div className="h-72 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* 3. Recent Users Table (Filtered for Users and Instructors by API/Logic) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Recent User Registrations</h3>
            <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition">View All Users</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">User Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Join Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                            {user.name.charAt(0)}
                          </div>
                          <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                            user.role === 'Instructor' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                        }`}>
                            {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.joinDate}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 flex w-fit items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          {user.status}
                        </span>
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
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <Users size={32} className="opacity-20" />
                        <p>No recent users found.</p>
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

// Helper Component for Stats Cards
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

export default AdminDashboard;