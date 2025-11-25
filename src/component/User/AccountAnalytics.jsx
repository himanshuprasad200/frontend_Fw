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
    dispatch(myBids()); // Fetch real bids
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // === REAL BID STATUS BREAKDOWN ===
  const bidStats = useMemo(() => {
    const total = bids.length;

    const approved = bids.filter(b => b.response === "Approved").length;
    const pending = bids.filter(b => b.response === "Pending").length;
    const rejected = bids.filter(b => b.response === "Rejected").length;

    const winRate = total > 0 ? ((approved / total) * 100).toFixed(1) : 0;

    // Monthly bid growth
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

    return {
      total,
      approved,
      pending,
      rejected,
      winRate: Number(winRate),
      growth: growth.toFixed(1),
    };
  }, [bids]);

  const totalEarnings = useMemo(() => earnings.reduce((s, e) => s + e.amount, 0), [earnings]);

  // Monthly Earnings Chart
  const monthlyEarnings = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const amount = earnings
        .filter(e => {
          const ed = new Date(e.recievedAt);
          return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
        })
        .reduce((s, e) => s + e.amount, 0);

      data.push({ label: months[d.getMonth()], amount });
    }

    return { labels: data.map(d => d.label), values: data.map(d => d.amount) };
  }, [earnings]);

  // === DOUGHNUT CHART – REAL STATUS BREAKDOWN ===
  const doughnutData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [{
      data: [bidStats.approved, bidStats.pending, bidStats.rejected],
      backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
      borderColor: "#fff",
      borderWidth: 3,
      hoverOffset: 10,
    }]
  };

  const lineData = {
    labels: monthlyEarnings.labels,
    datasets: [{
      label: "Earnings",
      data: monthlyEarnings.values,
      fill: true,
      backgroundColor: "rgba(14, 165, 233, 0.15)",
      borderColor: "#0ea5e9",
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { ticks: { callback: v => "₹" + v.toLocaleString() } } }
  };

  return (
    <div className="freelancer-dashboard">
      <div className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <p>Welcome back, <strong>{user?.name || "Freelancer"}</strong>! Track your real progress.</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card earnings">
          <i className="fas fa-wallet"></i>
          <div>
            <p>Total Earnings</p>
            <h2>₹{totalEarnings.toLocaleString()}</h2>
            <span className="growth">From won projects</span>
          </div>
        </div>

        <div className="kpi-card bids">
          <i className="fas fa-gavel"></i>
          <div>
            <p>Bids Placed</p>
            <h2>{bidStats.total}</h2>
            <span className="growth">
              {bidStats.approved} Approved • {bidStats.rejected} Rejected
            </span>
          </div>
        </div>

        <div className="kpi-card winrate">
          <i className="fas fa-trophy"></i>
          <div>
            <p>Win Rate</p>
            <h2>{bidStats.winRate}%</h2>
            <span className={`growth ${bidStats.growth >= 0 ? 'positive' : 'negative'}`}>
              {bidStats.growth >= 0 ? 'Up' : 'Down'} {Math.abs(bidStats.growth)}% vs last month
            </span>
          </div>
        </div>

        <div className="kpi-card reviews">
          <i className="fas fa-star"></i>
          <div>
            <p>Client Rating</p>
            <h2>{user?.ratings?.toFixed(1) || "0.0"}</h2>
            <span className="growth">{user?.numOfReviews || 0} Reviews</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-row">
        {/* Earnings Over Time */}
        <div className="chart-box large">
          <h3>Earnings Growth (Last 6 Months)</h3>
          <div className="chart-wrapper">
            {earningsLoading ? <Loader /> : <Line data={lineData} options={chartOptions} />}
          </div>
        </div>

        {/* Bid Status Distribution */}
        <div className="chart-box">
          <h3>Bid Status Overview</h3>
          <div className="chart-wrapper doughnut">
            <Doughnut 
              data={doughnutData} 
              options={{
                cutout: "68%",
                plugins: {
                  legend: { position: "bottom", labels: { padding: 20, font: { size: 14 } } },
                  tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed}` } }
                }
              }} 
            />
          </div>
        </div>

        {/* Recent Payments */}
        <div className="chart-box activity">
          <h3>Recent Payments</h3>
          <div className="activity-list">
            {earnings.length === 0 ? (
              <p className="no-activity">No payments received yet</p>
            ) : (
              earnings.slice(-5).reverse().map((e, i) => (
                <div key={i} className="activity-item">
                  <div>
                    <strong>₹{e.amount.toLocaleString()}</strong>
                    <small>{new Date(e.recievedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "2-digit"
                    })}</small>
                  </div>
                  <i className="fas fa-check-circle text-success"></i>
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