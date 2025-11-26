// src/component/admin/JoinAsClient.jsx
import React, { useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import "./JoinAsClient.css";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";

import { getAdminProject } from "../../actions/projectAction";
import { getAllBids } from "../../actions/bidAction";
import { getAllUsers } from "../../actions/userAction";
import { getAllEarnings } from "../../actions/earningAction";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const JoinAsClient = () => {
  const dispatch = useDispatch();

  // SAFELY extract data — handles any Redux state shape
  const projectsState = useSelector((state) => state.projects || state.adminProjects || {});
  const bidsState = useSelector((state) => state.allBids || {});
  const usersState = useSelector((state) => state.allUsers || {});
  const earningState = useSelector((state) => state.allEarning || {});

  // Normalize to arrays — this fixes the crash
  const projects = Array.isArray(projectsState.projects) ? projectsState.projects : 
                   Array.isArray(projectsState) ? projectsState : [];

  const bids = Array.isArray(bidsState.bids) ? bidsState.bids : 
               Array.isArray(bidsState) ? bidsState : [];

  const users = Array.isArray(usersState.users) ? usersState.users : 
                Array.isArray(usersState) ? usersState : [];

  const earning = Array.isArray(earningState.earning) ? earningState.earning :
                  Array.isArray(earningState) ? earningState : [];

  const loading = projectsState.loading || bidsState.loading || usersState.loading || earningState.loading;

  useEffect(() => {
    dispatch(getAdminProject());
    dispatch(getAllBids());
    dispatch(getAllUsers());
    dispatch(getAllEarnings());
  }, [dispatch]);

  // TOTAL REVENUE — 100% safe
  const totalRevenue = useMemo(() => {
    if (!Array.isArray(earning) || earning.length === 0) return 0;
    return earning.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [earning]);

  // BID STATS
  const bidStats = useMemo(() => {
    if (!Array.isArray(bids)) return { approved: 0, pending: 0, rejected: 0, total: 0 };
    const approved = bids.filter(b => b.response === "Approved").length;
    const pending = bids.filter(b => b.response === "Pending").length;
    const rejected = bids.filter(b => b.response === "Rejected").length;
    return { approved, pending, rejected, total: bids.length };
  }, [bids]);

  // MONTHLY PROJECTS — Working & Simple
  const monthlyProjectData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const counts = [0, 0, 0, 0, 0, 0]; // last 6 months

    if (Array.isArray(projects) && projects.length > 0) {
      projects.forEach(p => {
        if (!p.createdAt) return;
        const date = new Date(p.createdAt);
        const monthDiff = (currentYear - date.getFullYear()) * 12 + (currentMonth - date.getMonth());

        if (monthDiff >= 0 && monthDiff <= 5) {
          counts[5 - monthDiff]++;
        }
      });
    }

    const labels = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      labels.push(months[d.getMonth()]);
    }

    return { labels, values: counts };
  }, [projects]);

  // EARNINGS CHART DATA
  const earningsChartData = useMemo(() => {
    if (!Array.isArray(earning) || earning.length === 0) {
      return { labels: ["No Data"], values: [0] };
    }

    const sorted = [...earning]
      .filter(e => e.recievedAt && e.amount)
      .sort((a, b) => new Date(a.recievedAt) - new Date(b.recievedAt));

    return {
      labels: sorted.map(e => new Date(e.recievedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })),
      values: sorted.map(e => Number(e.amount) || 0),
    };
  }, [earning]);

  // CHART DATA
  const lineData = {
    labels: earningsChartData.labels,
    datasets: [{
      label: "Revenue",
      data: earningsChartData.values,
      fill: true,
      backgroundColor: "rgba(14, 165, 233, 0.15)",
      borderColor: "#0ea5e9",
      tension: 0.4,
      pointRadius: 6,
      pointBackgroundColor: "#0ea5e9",
    }]
  };

  const barData = {
    labels: monthlyProjectData.labels,
    datasets: [{
      label: "Projects",
      data: monthlyProjectData.values,
      backgroundColor: "#8b5cf6",
      borderRadius: 12,
    }]
  };

  const doughnutData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [{
      data: bidStats.total > 0 ? [bidStats.approved, bidStats.pending, bidStats.rejected] : [1, 1, 1],
      backgroundColor: bidStats.total > 0 ? ["#10b981", "#f59e0b", "#ef4444"] : ["#e2e8f0", "#e2e8f0", "#e2e8f0"],
      borderWidth: 4,
      borderColor: "#fff",
      hoverOffset: 16,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        cornerRadius: 12,
        displayColors: false,
      }
    },
    scales: {
      y: { ticks: { color: "#64748b" }, grid: { color: "rgba(14, 165, 233, 0.1)" } },
      x: { ticks: { color: "#64748b" }, grid: { display: false } }
    }
  };

  return (
    <div className="admin-master">
      <Sidebar />

      <div className="admin-content">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Real-time platform analytics</p>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card revenue">
            <i className="fas fa-rupee-sign"></i>
            <div>
              <p>Total Revenue</p>
              <h2>₹{totalRevenue.toLocaleString()}</h2>
              <small>{earning.length} payments</small>
            </div>
          </div>

          <div className="kpi-card projects">
            <i className="fas fa-briefcase"></i>
            <div>
              <p>Total Projects</p>
              <h2>{projects.length}</h2>
              <small>All time</small>
            </div>
          </div>

          <div className="kpi-card bids">
            <i className="fas fa-gavel"></i>
            <div>
              <p>Total Bids</p>
              <h2>{bidStats.total}</h2>
              <small>{bidStats.approved} won</small>
            </div>
          </div>

          <div className="kpi-card users">
            <i className="fas fa-users"></i>
            <div>
              <p>Total Users</p>
              <h2>{users.length}</h2>
              <small>Active members</small>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-card large">
            <h3>Earnings Growth</h3>
            <div className="chart-wrapper">
              {loading ? <div className="chart-skeleton">Loading...</div> :
               earningsChartData.values.length > 1 ? <Line data={lineData} options={chartOptions} /> :
               <div className="no-data"><i className="fas fa-chart-line fa-3x"></i><p>No earnings yet</p></div>
              }
            </div>
          </div>

          <div className="chart-card">
            <h3>Projects (Last 6 Months)</h3>
            <div className="chart-wrapper">
              {loading ? <div className="chart-skeleton">Loading...</div> :
               monthlyProjectData.values.some(v => v > 0) ? <Bar data={barData} options={chartOptions} /> :
               <div className="no-data"><i className="fas fa-chart-bar fa-3x"></i><p>No projects in last 6 months</p></div>
              }
            </div>
          </div>

          <div className="chart-card">
            <h3>Bid Status</h3>
            <div className="chart-wrapper doughnut">
              {loading ? <div className="chart-skeleton">Loading...</div> :
               bidStats.total > 0 ? <Doughnut data={doughnutData} options={{ cutout: "68%" }} /> :
               <div className="no-data"><i className="fas fa-gavel fa-3x"></i><p>No bids yet</p></div>
              }
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <Link to="/admin/project" className="action-btn primary">Create Project</Link>
          <Link to="/admin/users" className="action-btn secondary">Manage Users</Link>
        </div>
      </div>
    </div>
  );
};

export default JoinAsClient;