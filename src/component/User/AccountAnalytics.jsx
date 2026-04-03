// src/component/User/AccountAnalytics.jsx
import React, { useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { fetchEarnings } from "../../actions/earningAction";
import { myBids } from "../../actions/bidAction";
import Loader from "../layout/Loader/Loader";
import toast from "react-hot-toast";
import "./AccountAnalytics.css";
import { 
  FiPieChart, 
  FiTrendingUp, 
  FiDollarSign, 
  FiCheckCircle, 
  FiStar, 
  FiBriefcase 
} from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AccountAnalytics = () => {
  const dispatch = useDispatch();

  const { earnings = [], loading: earningsLoading, error } = useSelector((state) => state.userEarnings || {});
  const { bids = [], loading: bidsLoading } = useSelector((state) => state.myBids || {});
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchEarnings());
    dispatch(myBids());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const bidStats = useMemo(() => {
    const total = bids.length;
    const approved = bids.filter(b => b.response === "Approved").length;
    const pending = bids.filter(b => b.response === "Pending").length;
    const rejected = bids.filter(b => b.response === "Rejected").length;
    const winRate = total > 0 ? ((approved / total) * 100).toFixed(1) : 0;

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const bidsThisMonth = bids.filter(b => {
      const d = new Date(b.createdAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    const bidsLastMonth = bids.filter(b => {
      const d = new Date(b.createdAt);
      return d.getMonth() === lastMonth && d.getFullYear() === lastYear;
    }).length;

    const growth = bidsLastMonth === 0
      ? (bidsThisMonth > 0 ? 100 : 0)
      : ((bidsThisMonth - bidsLastMonth) / bidsLastMonth) * 100;

    return { total, approved, pending, rejected, winRate: Number(winRate), growth: growth.toFixed(1) };
  }, [bids]);

  const totalEarnings = useMemo(() => {
    if (!Array.isArray(earnings)) return 0;
    return earnings.reduce((s, e) => s + e.amount, 0);
  }, [earnings]);

  const monthlyEarnings = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const amount = Array.isArray(earnings) 
        ? earnings
            .filter(e => {
              const ed = new Date(e.recievedAt);
              return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
            })
            .reduce((s, e) => s + e.amount, 0)
        : 0;
      data.push({ label: months[d.getMonth()], amount });
    }
    return { labels: data.map(d => d.label), values: data.map(d => d.amount) };
  }, [earnings]);

  const doughnutData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [{
      data: [bidStats.approved, bidStats.pending, bidStats.rejected],
      backgroundColor: ["#7ec8c0", "#1a1a2e", "#ff4d4d"],
      borderColor: "#fff",
      borderWidth: 4,
      hoverOffset: 12,
    }]
  };

  const lineData = {
    labels: monthlyEarnings.labels,
    datasets: [{
      label: "Revenue (INR)",
      data: monthlyEarnings.values,
      fill: true,
      backgroundColor: "rgba(126, 200, 192, 0.15)",
      borderColor: "#7ec8c0",
      borderWidth: 4,
      tension: 0.45,
      pointRadius: 6,
      pointBackgroundColor: "#1a1a2e",
      pointBorderColor: "#7ec8c0",
      pointBorderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a2e',
        padding: 12,
        titleFont: { family: 'Barlow Condensed', size: 16 },
        bodyFont: { family: 'Inter', size: 14 }
      }
    },
    scales: { 
      y: { grid: { color: '#f1f5f9' }, ticks: { font: { weight: '600' }, callback: v => "₹" + v.toLocaleString() } },
      x: { grid: { display: false }, ticks: { font: { weight: '600' } } }
    }
  };

  return (
    <div className="freelancer-dashboard">
      <div className="dashboard-header">
        <h1>Account Performance</h1>
        <p>Insights for <strong>{user?.name || "Professional"}</strong> • Real-time profile metrics</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card earnings">
          <FiDollarSign />
          <div>
            <p>Net Revenue</p>
            <h2>₹{totalEarnings.toLocaleString()}</h2>
            <span className="growth positive">Verified Earnings</span>
          </div>
        </div>

        <div className="kpi-card bids">
          <FiBriefcase />
          <div>
            <p>Active Proposals</p>
            <h2>{bidStats.total}</h2>
            <span className="growth" style={{color: '#94a3b8'}}>
              {bidStats.approved} Success Ratio
            </span>
          </div>
        </div>

        <div className="kpi-card winrate">
          <FiTrendingUp />
          <div>
            <p>Win Rate</p>
            <h2>{bidStats.winRate}%</h2>
            <span className={`growth ${Number(bidStats.growth) >= 0 ? 'positive' : 'negative'}`}>
              {Number(bidStats.growth) >= 0 ? '▲' : '▼'} {Math.abs(bidStats.growth)}% momentum
            </span>
          </div>
        </div>

        <div className="kpi-card reviews">
          <FiStar />
          <div>
            <p>Reputation Score</p>
            <h2>{user?.ratings?.toFixed(1) || "0.0"}</h2>
            <span className="growth" style={{color: '#94a3b8'}}>{user?.numOfReviews || 0} reviews</span>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-box large">
          <h3><FiTrendingUp /> Revenue Trajectory</h3>
          <div className="chart-wrapper">
            {earningsLoading ? (
              <div className="chart-overlay-loader"><Loader /></div>
            ) : <Line data={lineData} options={chartOptions} />}
          </div>
        </div>

        <div className="chart-box">
          <h3><FiPieChart /> Conversion Funnel</h3>
          <div className="chart-wrapper doughnut">
            <Doughnut 
              data={doughnutData} 
              options={{
                cutout: "75%",
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom", labels: { padding: 30, font: { family: 'Barlow Condensed', size: 15, weight: '700' } } },
                }
              }} 
            />
          </div>
        </div>

        <div className="chart-box activity">
          <h3><FiCheckCircle /> Recent Invoices</h3>
          <div className="activity-list">
            {earnings.length === 0 ? (
              <p className="no-activity">No payment history found</p>
            ) : (
              earnings.slice(-5).reverse().map((e, i) => (
                <div key={i} className="activity-item">
                  <div>
                    <strong>₹{e.amount.toLocaleString()}</strong>
                    <small>Received: {new Date(e.recievedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short"
                    })}</small>
                  </div>
                  <FiCheckCircle className="text-success" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountAnalytics;