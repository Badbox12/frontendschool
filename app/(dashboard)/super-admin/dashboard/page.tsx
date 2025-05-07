"use client";
import { useState, useEffect } from "react";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  Filler
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { useAppSelector } from "@/app/hook/hooks";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock data for dashboard statistics
const mockData = {
  activeAdmins: 23,
  pendingAdmins: 5,
  activeSchools: 128,
  students: 4592,
  teachers: 312,
  courses: 87,
  recentLogins: [
    { id: 1, name: "Sarah Johnson", role: "Admin", timestamp: "2025-05-07T02:45:12Z", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Michael Chen", role: "Admin", timestamp: "2025-05-07T01:32:45Z", avatar: "https://i.pravatar.cc/150?img=8" },
    { id: 3, name: "Aisha Patel", role: "Admin", timestamp: "2025-05-06T23:17:33Z", avatar: "https://i.pravatar.cc/150?img=5" },
    { id: 4, name: "Carlos Rodriguez", role: "Admin", timestamp: "2025-05-06T22:05:19Z", avatar: "https://i.pravatar.cc/150?img=3" },
  ],
  systemNotifications: [
    { id: 1, message: "System update scheduled for May 10, 2025", severity: "info", timestamp: "2025-05-07T01:00:00Z" },
    { id: 2, message: "Database optimization complete - 15% performance increase", severity: "success", timestamp: "2025-05-06T18:30:00Z" },
    { id: 3, message: "Alert: Unusual login activity detected from IP 203.45.67.89", severity: "warning", timestamp: "2025-05-06T14:25:00Z" },
    { id: 4, message: "Server memory usage exceeding 85% threshold", severity: "error", timestamp: "2025-05-06T10:12:00Z" },
  ],
};

// Chart data
const userGrowthData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Admin Users",
      data: [15, 18, 20, 22, 24, 28, 31],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      tension: 0.4,
      fill: true,
    },
    {
      label: "Teachers",
      data: [150, 180, 200, 250, 270, 290, 310],
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      tension: 0.4,
      fill: true,
    },
    {
      label: "Students",
      data: [2000, 2500, 3000, 3500, 4000, 4250, 4500],
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      tension: 0.4,
      fill: true,
    },
  ],
};

const schoolTypeData = {
  labels: ["Elementary", "Middle School", "High School", "University", "Training Center"],
  datasets: [
    {
      label: "School Types",
      data: [45, 32, 28, 15, 8],
      backgroundColor: [
        "rgba(255, 99, 132, 0.8)",
        "rgba(54, 162, 235, 0.8)",
        "rgba(255, 206, 86, 0.8)",
        "rgba(75, 192, 192, 0.8)",
        "rgba(153, 102, 255, 0.8)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const activityData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Daily Active Users",
      data: [1250, 1420, 1550, 1350, 1480, 950, 850],
      backgroundColor: "rgba(75, 192, 192, 0.8)",
    },
  ],
};

// Helper function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Helper function for notification severity colors
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "info": return "bg-blue-100 text-blue-800 border-blue-200";
    case "success": return "bg-green-100 text-green-800 border-green-200";
    case "warning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "error": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// StatCard component
const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: string, color: string }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex items-center justify-between">
    <div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <p className="mt-1 text-2xl font-semibold">{value.toLocaleString()}</p>
    </div>
    <div className={`p-3 rounded-full ${color}`}>
      <i className={`fas ${icon} text-white`}></i>
    </div>
  </div>
);

const SuperAdminDashboardPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.username || 'Super Admin'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit' 
          })}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Active Admins" 
          value={mockData.activeAdmins} 
          icon="fa-user-shield" 
          color="bg-blue-600" 
        />
        <StatCard 
          title="Total Schools" 
          value={mockData.activeSchools} 
          icon="fa-school" 
          color="bg-green-600" 
        />
        <StatCard 
          title="Total Teachers" 
          value={mockData.teachers} 
          icon="fa-chalkboard-teacher" 
          color="bg-purple-600" 
        />
        <StatCard 
          title="Total Students" 
          value={mockData.students} 
          icon="fa-user-graduate" 
          color="bg-orange-600" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">User Growth Trends</h2>
          <div className="h-80">
            <Line 
              data={userGrowthData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  }
                },
              }} 
            />
          </div>
        </div>
        
        {/* School Types Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">School Distribution</h2>
          <div className="h-80">
            <Doughnut 
              data={schoolTypeData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  }
                },
              }} 
            />
          </div>
        </div>
      </div>

      {/* Activity and Recent Logins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Activity</h2>
          <div className="h-72">
            <Bar
              data={activityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  }
                },
              }}
            />
          </div>
        </div>
        
        {/* Recent Logins */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Admin Logins</h2>
          <div className="space-y-4">
            {mockData.recentLogins.map(login => (
              <div key={login.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img 
                  src={login.avatar} 
                  alt={login.name} 
                  className="w-10 h-10 rounded-full mr-3" 
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{login.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(login.timestamp)}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {login.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">System Notifications</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {mockData.systemNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(notification.severity)}`}
            >
              <div className="flex justify-between">
                <p className="text-sm font-medium">{notification.message}</p>
                <span className="text-xs text-gray-500">
                  {formatDate(notification.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: "fa-user-plus", title: "Add Admin", color: "bg-blue-600" },
            { icon: "fa-school", title: "Add School", color: "bg-green-600" },
            { icon: "fa-cog", title: "Settings", color: "bg-gray-600" },
            { icon: "fa-chart-line", title: "Reports", color: "bg-purple-600" },
            { icon: "fa-shield-alt", title: "Security", color: "bg-red-600" },
            { icon: "fa-question-circle", title: "Help", color: "bg-yellow-600" },
          ].map((action, index) => (
            <button 
              key={index} 
              className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-2`}>
                <i className={`fas ${action.icon} text-white`}></i>
              </div>
              <span className="text-sm font-medium">{action.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboardPage;