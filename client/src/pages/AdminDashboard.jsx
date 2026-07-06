import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Car,
  IndianRupee,
  TrendingUp,
  MapPin,
  Clock,
  Check,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  Search,
  Shield,
  BarChart3,
  Navigation,
  Ban,
  RefreshCw,
  Activity,
  Mail,
  Phone,
  Calendar,
  ChevronDown,
  ToggleLeft,
  MoreVertical,
  UserCheck,
  UserX,
} from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { useAuth } from '../hooks/useAuth';
import { formatDate, formatShortDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/calculateFare';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'revenue', label: 'Revenue', icon: IndianRupee },
  { id: 'rides', label: 'Rides', icon: Car },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'users', label: 'Users', icon: Users },
];

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const refresh = useCallback(() => setLastRefresh(Date.now()), []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await adminApi.getStats();
      setStats(res.data.data);
    } catch {
      toast.error('Failed to load admin stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats, lastRefresh]);
  useEffect(() => { if (activeTab === 'overview') fetchStats(); }, [activeTab, fetchStats]);

  if (loading) return <Loader size="lg" text="Loading admin dashboard..." />;
  if (!stats) return <div className="admin-error">Failed to load data</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>🛡️ Admin Dashboard</h1>
          <p>Manage your platform, {currentUser?.name}</p>
        </div>
        <div className="admin-header-right">
          <motion.button className="btn btn-outline btn-sm" onClick={refresh} whileTap={{ scale: 0.95 }}>
            <RefreshCw size={14} /> Refresh
          </motion.button>
          <span className="admin-badge"><Shield size={14} /> Admin</span>
        </div>
      </div>

      <div className="admin-tabs">
        {TABS.map((tab) => (
          <button key={tab.id} className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <tab.icon size={16} /><span>{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && <OverviewTab stats={stats} key="ov" />}
        {activeTab === 'revenue' && <RevenueTab key="rev" />}
        {activeTab === 'rides' && <RidesTab onMutation={refresh} key="ri" />}
        {activeTab === 'locations' && <LocationsTab key="lo" />}
        {activeTab === 'users' && <UsersTab onMutation={refresh} key="us" />}
      </AnimatePresence>

      <style>{`
        .admin-page { padding: 2rem; max-width: 1200px; margin: 0 auto; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .admin-header h1 { font-size: 1.5rem; font-weight: 800; color: var(--text-primary); }
        .admin-header p { color: var(--text-muted); font-size: 0.9rem; }
        .admin-header-right { display: flex; align-items: center; gap: 0.75rem; }
        .admin-badge { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.4rem 1rem; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border-radius: 20px; font-size: 0.78rem; font-weight: 700; }
        .admin-tabs { display: flex; gap: 0.4rem; margin-bottom: 2rem; overflow-x: auto; padding-bottom: 0.5rem; }
        .admin-tab { display: flex; align-items: center; gap: 0.4rem; padding: 0.55rem 1.1rem; border-radius: 12px; border: 1px solid var(--border); background: var(--surface); color: var(--text-muted); font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .admin-tab:hover { border-color: var(--primary); color: var(--primary); }
        .admin-tab.active { background: var(--primary); border-color: var(--primary); color: white; }
        .admin-error { text-align: center; padding: 4rem; color: var(--text-muted); }
        .admin-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; transition: background 0.3s, border-color 0.3s; }
        .admin-card h3 { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1.25rem; }
        @media (max-width: 768px) { .admin-page { padding: 1rem; } }
      `}</style>
    </div>
  );
};

/* ============================
   SHARED STYLES + COMPONENTS
   ============================ */
const SharedStyles = () => (
  <style>{`
    .toolbar { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem; }
    .toolbar-search { display: flex; align-items: center; gap: 0.5rem; }
    .toolbar-search input { flex: 1; padding: 0.6rem 1rem; border: 1px solid var(--border); border-radius: 12px; font-size: 0.88rem; background: var(--surface); color: var(--text-primary); outline: none; font-family: inherit; }
    .toolbar-search input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }
    .toolbar-search svg { color: var(--text-muted); }
    .toolbar-filters { display: flex; gap: 0.4rem; flex-wrap: wrap; }
    .filter-pill { padding: 0.4rem 0.85rem; border-radius: 20px; border: 1px solid var(--border); background: var(--surface); color: var(--text-muted); font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s; text-transform: capitalize; }
    .filter-pill:hover { border-color: var(--primary); color: var(--primary); }
    .filter-pill.active { background: var(--primary); border-color: var(--primary); color: white; }
    .count-label { color: var(--text-muted); font-size: 0.8rem; margin-bottom: 1rem; }
    .empty-card { background: var(--surface); border: 2px dashed var(--border); border-radius: 20px; padding: 3rem; text-align: center; color: var(--text-muted); }
    .empty-card h3 { color: var(--text-primary); margin-top: 0.75rem; font-size: 1.1rem; }
    .empty-card p { margin-top: 0.4rem; font-size: 0.9rem; }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1.5rem; }
    .pagination button { display: flex; align-items: center; gap: 0.3rem; padding: 0.55rem 1.1rem; border-radius: 12px; border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); cursor: pointer; font-weight: 600; font-size: 0.85rem; transition: all 0.2s; font-family: inherit; }
    .pagination button:hover:not(:disabled) { background: var(--primary-light); color: var(--primary); border-color: var(--primary); }
    .pagination button:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-info { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }
    .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; display: inline-block; }
    .dot.green { background: #22c55e; }
    .dot.red { background: #ef4444; }
  `}</style>
);

/* ============================
   OVERVIEW TAB
   ============================ */
const OverviewTab = ({ stats }) => {
  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#3b82f6', bg: '#dbeafe' },
    { label: 'Total Drivers', value: stats.totalDrivers, icon: Car, color: '#22c55e', bg: '#dcfce7' },
    { label: 'Total Rides', value: stats.totalRides, icon: Navigation, color: '#a855f7', bg: '#ede9fe' },
    { label: 'Revenue', value: formatCurrency(stats.totalRevenue), icon: IndianRupee, color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Completed', value: stats.completedRides, icon: Check, color: '#10b981', bg: '#d1fae5' },
    { label: 'Ongoing', value: stats.ongoingRides, icon: Activity, color: '#3b82f6', bg: '#dbeafe' },
    { label: 'Pending', value: stats.pendingRides, icon: AlertTriangle, color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Cancelled', value: stats.cancelledRides, icon: X, color: '#ef4444', bg: '#fee2e2' },
  ];
  const completionRate = stats.totalRides > 0 ? Math.round((stats.completedRides / stats.totalRides) * 100) : 0;
  const cancellationRate = stats.totalRides > 0 ? Math.round((stats.cancelledRides / stats.totalRides) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="overview-grid">
        {cards.map((c, i) => (
          <motion.div key={c.label} className="overview-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -3 }}>
            <div className="overview-icon" style={{ background: c.bg }}><c.icon size={20} color={c.color} /></div>
            <div className="overview-info">
              <span className="overview-value" style={{ color: c.color }}>{c.value}</span>
              <span className="overview-label">{c.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="health-row">
        <div className="admin-card health-card">
          <h3>📈 Completion Rate</h3>
          <div className="progress-ring-wrap">
            <svg className="progress-ring" viewBox="0 0 120 120"><circle className="progress-bg" cx="60" cy="60" r="50" /><circle className="progress-fill" cx="60" cy="60" r="50" style={{ strokeDasharray: `${2*Math.PI*50}`, strokeDashoffset: `${2*Math.PI*50*(1-completionRate/100)}`, stroke: '#22c55e' }} /></svg>
            <div className="progress-text"><span className="progress-pct">{completionRate}%</span><span className="progress-sub">Completed</span></div>
          </div>
          <p className="health-detail">{stats.completedRides} of {stats.totalRides} rides</p>
        </div>
        <div className="admin-card health-card">
          <h3>❌ Cancellation Rate</h3>
          <div className="progress-ring-wrap">
            <svg className="progress-ring" viewBox="0 0 120 120"><circle className="progress-bg" cx="60" cy="60" r="50" /><circle className="progress-fill" cx="60" cy="60" r="50" style={{ strokeDasharray: `${2*Math.PI*50}`, strokeDashoffset: `${2*Math.PI*50*(1-cancellationRate/100)}`, stroke: cancellationRate > 20 ? '#ef4444' : '#f59e0b' }} /></svg>
            <div className="progress-text"><span className="progress-pct">{cancellationRate}%</span><span className="progress-sub">Cancelled</span></div>
          </div>
          <p className="health-detail">{stats.cancelledRides} of {stats.totalRides} rides</p>
        </div>
        <div className="admin-card health-card">
          <h3>💰 Avg Fare</h3>
          <div className="big-number"><IndianRupee size={28} color="#a855f7" /><span>{formatCurrency(stats.avgFare)}</span></div>
          <p className="health-detail">Across {stats.completedRides} completed rides</p>
        </div>
      </div>
      {stats.revenueByType?.length > 0 && (
        <div className="admin-card" style={{ marginTop: '1.5rem' }}>
          <h3>🚗 Ride Type Breakdown</h3>
          <div className="type-breakdown">
            {stats.revenueByType.map((item) => {
              const pct = stats.totalRides > 0 ? (item.count / stats.totalRides) * 100 : 0;
              return (
                <div key={item._id} className="type-row">
                  <span className="type-emoji">{item._id === 'economy' ? '🚗' : item._id === 'comfort' ? '🚙' : '🏎️'}</span>
                  <div className="type-info"><div className="type-top"><span className="type-name">{item._id}</span><span className="type-meta">{item.count} rides • {formatCurrency(item.revenue)}</span></div><div className="type-bar-wrap"><motion.div className="type-bar" style={{ background: item._id === 'economy' ? '#3b82f6' : item._id === 'comfort' ? '#a855f7' : '#f59e0b' }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} /></div></div>
                  <span className="type-pct">{Math.round(pct)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <SharedStyles />
      <style>{`
        .overview-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .overview-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; transition: all 0.25s; }
        .overview-icon { width: 46px; height: 46px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .overview-info { display: flex; flex-direction: column; }
        .overview-value { font-size: 1.35rem; font-weight: 800; }
        .overview-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
        .health-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; }
        .health-card { text-align: center; }
        .progress-ring-wrap { position: relative; width: 130px; height: 130px; margin: 0 auto 0.75rem; }
        .progress-ring { width: 130px; height: 130px; transform: rotate(-90deg); }
        .progress-bg { fill: none; stroke: var(--surface-muted); stroke-width: 10; }
        .progress-fill { fill: none; stroke-width: 10; stroke-linecap: round; transition: stroke-dashoffset 1s ease; }
        .progress-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; }
        .progress-pct { font-size: 1.6rem; font-weight: 900; color: var(--text-primary); }
        .progress-sub { font-size: 0.7rem; color: var(--text-muted); font-weight: 500; }
        .health-detail { font-size: 0.82rem; color: var(--text-muted); }
        .big-number { display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 2rem; font-weight: 900; color: var(--text-primary); padding: 1.5rem 0 0.75rem; }
        .type-breakdown { display: flex; flex-direction: column; gap: 1rem; }
        .type-row { display: flex; align-items: center; gap: 0.75rem; }
        .type-emoji { font-size: 1.5rem; flex-shrink: 0; }
        .type-info { flex: 1; }
        .type-top { display: flex; justify-content: space-between; margin-bottom: 0.35rem; }
        .type-name { font-weight: 700; color: var(--text-primary); text-transform: capitalize; font-size: 0.9rem; }
        .type-meta { font-size: 0.78rem; color: var(--text-muted); }
        .type-bar-wrap { height: 10px; background: var(--surface-muted); border-radius: 5px; overflow: hidden; }
        .type-bar { height: 100%; border-radius: 5px; min-width: 4px; }
        .type-pct { font-weight: 800; font-size: 0.9rem; color: var(--text-primary); width: 40px; text-align: right; }
      `}</style>
    </motion.div>
  );
};

/* ============================
   REVENUE TAB
   ============================ */
const RevenueTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminApi.getStats().then((r) => setStats(r.data.data)).catch(() => toast.error('Failed to load revenue')).finally(() => setLoading(false)); }, []);
  if (loading) return <Loader />;
  if (!stats) return null;
  const hasDaily = stats.dailyRevenue?.length > 0;
  const hasMonthly = stats.monthlyRevenue?.length > 0;
  const maxDaily = hasDaily ? Math.max(...stats.dailyRevenue.map((d) => d.revenue), 1) : 1;
  const maxMonthly = hasMonthly ? Math.max(...stats.monthlyRevenue.map((m) => m.revenue), 1) : 1;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="rev-summary">
        <div className="rev-card hero"><div className="rev-hero-icon"><IndianRupee size={30} /></div><div><span className="rev-hero-label">Total Revenue</span><span className="rev-hero-amount">{formatCurrency(stats.totalRevenue)}</span></div></div>
        <div className="rev-card"><TrendingUp size={20} color="#a855f7" /><div><span className="rev-amount">{formatCurrency(stats.avgFare)}</span><span className="rev-label">Avg Fare</span></div></div>
        <div className="rev-card"><Check size={20} color="#22c55e" /><div><span className="rev-amount">{stats.completedRides}</span><span className="rev-label">Completed</span></div></div>
        <div className="rev-card"><Car size={20} color="#3b82f6" /><div><span className="rev-amount">{stats.totalRides}</span><span className="rev-label">Total Rides</span></div></div>
      </div>
      {stats.revenueByType?.length > 0 && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <h3>🏷️ Revenue by Ride Type</h3>
          <div className="rev-type-grid">{stats.revenueByType.map((item) => (<div key={item._id} className="rev-type-card"><span className="rev-type-emoji">{item._id === 'economy' ? '🚗' : item._id === 'comfort' ? '🚙' : '🏎️'}</span><span className="rev-type-name">{item._id}</span><span className="rev-type-revenue">{formatCurrency(item.revenue)}</span><span className="rev-type-count">{item.count} rides</span></div>))}</div>
        </div>
      )}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <h3>📅 Daily Revenue (Last 7 Days)</h3>
        {hasDaily ? (<div className="chart-scroll"><div className="chart-container">{stats.dailyRevenue.map((day, i) => (<div key={day._id || i} className="chart-col"><span className="chart-val">{formatCurrency(day.revenue)}</span><div className="chart-bar-track"><motion.div className="chart-bar" style={{ background: 'linear-gradient(180deg, #6366f1, #4f46e5)' }} initial={{ height: 0 }} animate={{ height: `${Math.max((day.revenue / maxDaily) * 100, 3)}%` }} transition={{ duration: 0.5, delay: i * 0.08 }} /></div><span className="chart-label">{day._id?.slice(5) || `D${i+1}`}</span><span className="chart-sub">{day.rides} rides</span></div>))}</div></div>) : (<div className="chart-empty"><Activity size={40} /><p>No daily revenue data yet</p><span>Revenue will appear once rides are completed</span></div>)}
      </div>
      <div className="admin-card">
        <h3>📊 Monthly Revenue (Last 6 Months)</h3>
        {hasMonthly ? (<div className="chart-scroll"><div className="chart-container">{stats.monthlyRevenue.map((month, i) => (<div key={month._id || i} className="chart-col"><span className="chart-val">{formatCurrency(month.revenue)}</span><div className="chart-bar-track"><motion.div className="chart-bar" style={{ background: 'linear-gradient(180deg, #a855f7, #7c3aed)' }} initial={{ height: 0 }} animate={{ height: `${Math.max((month.revenue / maxMonthly) * 100, 3)}%` }} transition={{ duration: 0.5, delay: i * 0.08 }} /></div><span className="chart-label">{month._id?.slice(5) || `M${i+1}`}</span><span className="chart-sub">{month.rides} rides</span></div>))}</div></div>) : (<div className="chart-empty"><BarChart3 size={40} /><p>No monthly revenue data yet</p><span>Monthly trends will appear with completed rides</span></div>)}
      </div>
      <style>{`
        .rev-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .rev-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; transition: all 0.2s; }
        .rev-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .rev-card.hero { background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; }
        .rev-hero-icon { width: 52px; height: 52px; border-radius: 16px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; }
        .rev-hero-label { display: block; font-size: 0.8rem; opacity: 0.85; }
        .rev-hero-amount { display: block; font-size: 1.6rem; font-weight: 900; }
        .rev-amount { display: block; font-size: 1.3rem; font-weight: 800; color: var(--text-primary); }
        .rev-label { display: block; font-size: 0.78rem; color: var(--text-muted); }
        .rev-type-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
        .rev-type-card { background: var(--surface-muted); border-radius: 14px; padding: 1.25rem; text-align: center; display: flex; flex-direction: column; gap: 0.3rem; }
        .rev-type-emoji { font-size: 2rem; }
        .rev-type-name { font-weight: 700; color: var(--text-primary); text-transform: capitalize; font-size: 0.9rem; }
        .rev-type-revenue { font-size: 1.3rem; font-weight: 900; color: var(--primary); }
        .rev-type-count { font-size: 0.75rem; color: var(--text-muted); }
        .chart-scroll { overflow-x: auto; }
        .chart-container { display: flex; align-items: flex-end; gap: 1rem; height: 240px; min-width: 400px; padding-top: 2rem; }
        .chart-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; gap: 0.3rem; min-width: 50px; }
        .chart-val { font-size: 0.7rem; font-weight: 700; color: var(--text-primary); white-space: nowrap; }
        .chart-bar-track { flex: 1; width: 100%; max-width: 56px; background: var(--surface-muted); border-radius: 10px 10px 6px 6px; display: flex; align-items: flex-end; overflow: hidden; }
        .chart-bar { width: 100%; border-radius: 10px 10px 0 0; min-height: 4px; }
        .chart-label { font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); }
        .chart-sub { font-size: 0.62rem; color: var(--text-muted); }
        .chart-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; padding: 3rem 2rem; color: var(--text-muted); text-align: center; }
        .chart-empty p { font-weight: 700; font-size: 1rem; color: var(--text-secondary); margin-top: 0.5rem; }
        .chart-empty span { font-size: 0.85rem; }
      `}</style>
    </motion.div>
  );
};

/* ============================
   RIDES TAB
   ============================ */
const statusColors = { pending: { bg: '#fef3c7', color: '#d97706' }, accepted: { bg: '#dbeafe', color: '#2563eb' }, ongoing: { bg: '#d1fae5', color: '#059669' }, completed: { bg: '#ede9fe', color: '#7c3aed' }, cancelled: { bg: '#fee2e2', color: '#dc2626' } };

const RidesTab = ({ onMutation }) => {
  const [rides, setRides] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [editingRide, setEditingRide] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchRides = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (appliedSearch) params.search = appliedSearch;
      const res = await adminApi.getAllRides(params);
      setRides(res.data.data.rides || []);
      setTotal(res.data.data.total);
      setPages(res.data.data.pages);
      setPage(p);
    } catch { toast.error('Failed to fetch rides'); }
    finally { setLoading(false); }
  }, [statusFilter, appliedSearch]);

  useEffect(() => { fetchRides(1); }, [fetchRides]);

  const handleSearch = () => setAppliedSearch(searchText);

  const handleDelete = async (id) => { if (!window.confirm('Delete this ride?')) return; try { await adminApi.deleteRide(id); toast.success('Ride deleted'); fetchRides(page); onMutation?.(); } catch { toast.error('Delete failed'); } };
  const openEdit = (ride) => { setEditingRide(ride._id); setEditForm({ status: ride.status, fare: ride.fare, rideType: ride.rideType, paymentStatus: ride.paymentStatus, pickup: ride.pickup?.address || '', dropoff: ride.dropoff?.address || '' }); };
  const handleEditSave = async (id) => { try { await adminApi.updateRide(id, { status: editForm.status, fare: Number(editForm.fare), rideType: editForm.rideType, paymentStatus: editForm.paymentStatus, pickup: { address: editForm.pickup }, dropoff: { address: editForm.dropoff } }); toast.success('Ride updated'); setEditingRide(null); fetchRides(page); onMutation?.(); } catch { toast.error('Update failed'); } };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="toolbar"><div className="toolbar-search"><Search size={16} /><input placeholder="Search by location..." value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} /><button className="btn btn-sm btn-primary" onClick={handleSearch}>Search</button></div><div className="toolbar-filters">{['', 'pending', 'ongoing', 'completed', 'cancelled'].map((s) => (<button key={s} className={`filter-pill ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>{s || 'All'}</button>))}</div></div>
      <p className="count-label">{total} ride{total !== 1 ? 's' : ''} found</p>
      {loading ? <Loader /> : rides.length === 0 ? (<div className="empty-card"><Car size={48} /><h3>No rides found</h3><p>{statusFilter ? `No ${statusFilter} rides` : 'No rides booked yet'}</p></div>) : (<><div className="rides-list">{rides.map((ride) => editingRide === ride._id ? (<div key={ride._id} className="ride-edit-card"><div className="edit-grid"><div className="edit-field"><label>Pickup</label><input value={editForm.pickup} onChange={(e) => setEditForm({ ...editForm, pickup: e.target.value })} /></div><div className="edit-field"><label>Dropoff</label><input value={editForm.dropoff} onChange={(e) => setEditForm({ ...editForm, dropoff: e.target.value })} /></div><div className="edit-field"><label>Status</label><select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}><option value="pending">Pending</option><option value="accepted">Accepted</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div><div className="edit-field"><label>Ride Type</label><select value={editForm.rideType} onChange={(e) => setEditForm({ ...editForm, rideType: e.target.value })}><option value="economy">Economy</option><option value="comfort">Comfort</option><option value="premium">Premium</option></select></div><div className="edit-field"><label>Fare (₹)</label><input type="number" value={editForm.fare} onChange={(e) => setEditForm({ ...editForm, fare: e.target.value })} /></div><div className="edit-field"><label>Payment</label><select value={editForm.paymentStatus} onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value })}><option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option></select></div></div><div className="edit-actions"><button className="btn btn-sm btn-primary" onClick={() => handleEditSave(ride._id)}><Check size={14} /> Save</button><button className="btn btn-sm btn-outline" onClick={() => setEditingRide(null)}>Cancel</button></div></div>) : (<div key={ride._id} className="ride-item-card"><div className="ride-item-top"><div className="ride-item-user"><div className="mini-avatar">{ride.user?.name?.charAt(0) || '?'}</div><div><span className="ride-item-name">{ride.user?.name || 'Unknown'}</span><span className="ride-item-email">{ride.user?.email}</span></div></div><span className="status-pill" style={statusColors[ride.status] || {}}>{ride.status}</span></div><div className="ride-item-route"><span className="dot green" /> <span>{ride.pickup?.address || '—'}</span><span className="route-arrow-sm">→</span><span className="dot red" /> <span>{ride.dropoff?.address || '—'}</span></div><div className="ride-item-meta"><span className="meta-tag">{ride.rideType === 'economy' ? '🚗' : ride.rideType === 'comfort' ? '🚙' : '🏎️'} {ride.rideType}</span><span className="meta-tag fare">{formatCurrency(ride.fare)}</span><span className="meta-tag">{ride.paymentStatus}</span><span className="meta-tag date">{formatShortDate(ride.createdAt)}</span></div><div className="ride-item-actions"><button className="action-btn edit" onClick={() => openEdit(ride)}><Edit3 size={15} /></button><button className="action-btn delete" onClick={() => handleDelete(ride._id)}><Trash2 size={15} /></button></div></div>))}</div>{pages > 1 && (<div className="pagination"><button disabled={page <= 1} onClick={() => fetchRides(page - 1)}><ChevronLeft size={16} /> Prev</button><span className="page-info">Page {page} of {pages}</span><button disabled={page >= pages} onClick={() => fetchRides(page + 1)}>Next <ChevronRight size={16} /></button></div>)}</>)}
      <SharedStyles />
      <style>{`
        .rides-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .ride-item-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; transition: all 0.2s; }
        .ride-item-card:hover { border-color: var(--primary-light); box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
        .ride-item-top { display: flex; justify-content: space-between; align-items: center; }
        .ride-item-user { display: flex; align-items: center; gap: 0.6rem; }
        .mini-avatar { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; }
        .ride-item-name { display: block; font-weight: 600; color: var(--text-primary); font-size: 0.9rem; }
        .ride-item-email { display: block; font-size: 0.72rem; color: var(--text-muted); }
        .status-pill { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.74rem; font-weight: 600; text-transform: capitalize; }
        .ride-item-route { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; font-size: 0.85rem; font-weight: 500; color: var(--text-primary); }
        .route-arrow-sm { color: var(--text-muted); font-size: 0.75rem; }
        .ride-item-meta { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .meta-tag { padding: 0.2rem 0.6rem; border-radius: 8px; font-size: 0.75rem; font-weight: 600; background: var(--surface-muted); color: var(--text-secondary); text-transform: capitalize; }
        .meta-tag.fare { color: var(--primary); background: var(--primary-light); font-weight: 700; }
        .meta-tag.date { color: var(--text-muted); }
        .ride-item-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
        .action-btn { width: 34px; height: 34px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: var(--text-muted); }
        .action-btn.edit:hover { background: var(--primary-light); color: var(--primary); border-color: var(--primary); }
        .action-btn.delete:hover { background: #fee2e2; color: #ef4444; border-color: #ef4444; }
        .ride-edit-card { background: var(--surface); border: 2px solid var(--primary); border-radius: 14px; padding: 1.25rem; }
        .edit-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
        .edit-field { display: flex; flex-direction: column; gap: 0.3rem; }
        .edit-field label { font-size: 0.72rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; }
        .edit-field input, .edit-field select { padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 10px; font-size: 0.85rem; background: var(--surface-muted); color: var(--text-primary); outline: none; font-family: inherit; }
        .edit-field input:focus, .edit-field select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }
        .edit-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
      `}</style>
    </motion.div>
  );
};

/* ============================
   LOCATIONS TAB
   ============================ */
const LocationsTab = () => {
  const [locations, setLocations] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminApi.getLocationStats().then((r) => setLocations(r.data.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false)); }, []);
  if (loading) return <Loader />;
  if (!locations) return null;
  const maxPickup = Math.max(...locations.topPickups.map((l) => l.count), 1);
  const maxDropoff = Math.max(...locations.topDropoffs.map((l) => l.count), 1);
  const maxRoute = Math.max(...locations.topRoutes.map((r) => r.count), 1);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="loc-grid">
        <div className="admin-card"><h3>📍 Top Pickups</h3>{locations.topPickups.length > 0 ? (<div className="loc-list">{locations.topPickups.map((loc, i) => (<div key={i} className="loc-item"><span className="loc-rank">#{i + 1}</span><div className="loc-bar-wrap"><div className="loc-bar-top"><span className="loc-name">{loc._id || 'Unknown'}</span><span className="loc-count">{loc.count}</span></div><div className="loc-bar-track"><motion.div className="loc-bar-fill" style={{ background: '#22c55e' }} initial={{ width: 0 }} animate={{ width: `${Math.max((loc.count / maxPickup) * 100, 3)}%` }} transition={{ duration: 0.5, delay: i * 0.06 }} /></div></div></div>))}</div>) : <p className="loc-empty">No data</p>}</div>
        <div className="admin-card"><h3>🏁 Top Drop-offs</h3>{locations.topDropoffs.length > 0 ? (<div className="loc-list">{locations.topDropoffs.map((loc, i) => (<div key={i} className="loc-item"><span className="loc-rank">#{i + 1}</span><div className="loc-bar-wrap"><div className="loc-bar-top"><span className="loc-name">{loc._id || 'Unknown'}</span><span className="loc-count">{loc.count}</span></div><div className="loc-bar-track"><motion.div className="loc-bar-fill" style={{ background: '#ef4444' }} initial={{ width: 0 }} animate={{ width: `${Math.max((loc.count / maxDropoff) * 100, 3)}%` }} transition={{ duration: 0.5, delay: i * 0.06 }} /></div></div></div>))}</div>) : <p className="loc-empty">No data</p>}</div>
      </div>
      <div className="admin-card" style={{ marginTop: '1.5rem' }}><h3>🛣️ Popular Routes</h3>{locations.topRoutes.length > 0 ? (<div className="routes-list">{locations.topRoutes.map((route, i) => (<div key={i} className="route-item"><span className="loc-rank">#{i + 1}</span><div className="route-detail"><div className="route-endpoints"><span className="route-end"><span className="dot green" /> {route._id?.pickup || '—'}</span><span className="route-arrow-sm">→</span><span className="route-end"><span className="dot red" /> {route._id?.dropoff || '—'}</span></div><div className="route-stats"><span className="route-count">{route.count} rides</span><span className="route-avg">Avg {formatCurrency(Math.round(route.avgFare))}</span><div className="route-mini-bar-track"><motion.div className="route-mini-bar" style={{ background: '#a855f7' }} initial={{ width: 0 }} animate={{ width: `${Math.max((route.count / maxRoute) * 100, 3)}%` }} transition={{ duration: 0.5, delay: i * 0.06 }} /></div></div></div></div>))}</div>) : <p className="loc-empty">No data</p>}</div>
      <style>{`
        .loc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .loc-list { display: flex; flex-direction: column; gap: 0.85rem; }
        .loc-item { display: flex; align-items: flex-start; gap: 0.6rem; }
        .loc-rank { font-size: 0.72rem; font-weight: 700; color: var(--text-muted); min-width: 26px; padding-top: 0.1rem; }
        .loc-bar-wrap { flex: 1; }
        .loc-bar-top { display: flex; justify-content: space-between; margin-bottom: 0.3rem; }
        .loc-name { font-size: 0.88rem; font-weight: 600; color: var(--text-primary); }
        .loc-count { font-size: 0.85rem; font-weight: 800; color: var(--text-primary); }
        .loc-bar-track { height: 8px; background: var(--surface-muted); border-radius: 4px; overflow: hidden; }
        .loc-bar-fill { height: 100%; border-radius: 4px; min-width: 4px; }
        .loc-empty { color: var(--text-muted); padding: 2rem; text-align: center; }
        .routes-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .route-item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem; background: var(--surface-muted); border-radius: 12px; }
        .route-detail { flex: 1; }
        .route-endpoints { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.4rem; }
        .route-end { display: flex; align-items: center; gap: 0.3rem; font-size: 0.88rem; font-weight: 600; color: var(--text-primary); }
        .route-stats { display: flex; align-items: center; gap: 0.75rem; }
        .route-count { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); }
        .route-avg { font-size: 0.8rem; font-weight: 700; color: var(--primary); }
        .route-mini-bar-track { flex: 1; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
        .route-mini-bar { height: 100%; border-radius: 3px; min-width: 4px; }
        @media (max-width: 768px) { .loc-grid { grid-template-columns: 1fr; } }
      `}</style>
    </motion.div>
  );
};

/* ============================
   USERS TAB — FIXED
   ============================ */
const roleConfig = {
  admin: { bg: '#fee2e2', color: '#dc2626', icon: Shield, label: 'Admin' },
  driver: { bg: '#dbeafe', color: '#2563eb', icon: Car, label: 'Driver' },
  user: { bg: '#d1fae5', color: '#059669', icon: Users, label: 'User' },
};

const UsersTab = ({ onMutation }) => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const fetchUsers = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 10 };
      if (roleFilter) params.role = roleFilter;
      if (appliedSearch) params.search = appliedSearch;
      const res = await adminApi.getAllUsers(params);
      setUsers(res.data.data.users || []);
      setTotal(res.data.data.total);
      setPages(res.data.data.pages);
      setPage(p);
    } catch {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [roleFilter, appliedSearch]);

  useEffect(() => { fetchUsers(1); }, [fetchUsers]);

  // Close menu on outside click using mousedown (fires before React click)
  // This uses a ref-based approach so removeEventListener works correctly
  useEffect(() => {
    if (!openMenuId) return;

    const handleMouseDown = (e) => {
      // If click is inside the menu, don't close
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      setOpenMenuId(null);
    };

    // Use setTimeout to avoid the opening click from immediately closing
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleMouseDown);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [openMenuId]);

  const handleSearch = () => setAppliedSearch(searchText);

  const closeMenu = () => setOpenMenuId(null);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminApi.updateUserRole(userId, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      closeMenu();
      fetchUsers(page);
      onMutation?.();
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await adminApi.deleteUser(id);
      toast.success('User deleted');
      closeMenu();
      fetchUsers(page);
      onMutation?.();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await adminApi.toggleUserActive(id);
      toast.success(currentStatus ? 'User deactivated' : 'User activated');
      closeMenu();
      fetchUsers(page);
      onMutation?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <SharedStyles />

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-search">
          <Search size={16} />
          <input
            placeholder="Search by name or email..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn btn-sm btn-primary" onClick={handleSearch}>Search</button>
        </div>
        <div className="toolbar-filters">
          {['', 'user', 'driver', 'admin'].map((r) => (
            <button
              key={r}
              className={`filter-pill ${roleFilter === r ? 'active' : ''}`}
              onClick={() => setRoleFilter(r)}
            >
              {r ? `${r.charAt(0).toUpperCase() + r.slice(1)}s` : 'All'}
            </button>
          ))}
        </div>
      </div>

      <p className="count-label">{total} user{total !== 1 ? 's' : ''} found</p>

      {loading ? <Loader /> : users.length === 0 ? (
        <div className="empty-card">
          <Users size={48} />
          <h3>No users found</h3>
          <p>{appliedSearch || roleFilter ? 'Try different filters' : 'No users registered yet'}</p>
        </div>
      ) : (
        <>
          <div className="user-list">
            {users.map((u, idx) => {
              const rc = roleConfig[u.role] || roleConfig.user;
              const RoleIcon = rc.icon;
              const isMenuOpen = openMenuId === u._id;
              return (
                <div key={u._id} className={`user-row ${!u.isActive ? 'disabled' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
                  <div className="user-row-idx">{(page - 1) * 10 + idx + 1}</div>

                  <div className="user-row-main">
                    <div className="user-row-avatar">
                      {u.avatar ? <img src={u.avatar} alt={u.name} /> : <span>{u.name?.charAt(0)?.toUpperCase() || 'U'}</span>}
                    </div>
                    <div className="user-row-info">
                      <span className="user-row-name">{u.name}</span>
                      <span className="user-row-email">{u.email}</span>
                    </div>
                  </div>

                  <div className="user-row-phone"><Phone size={13} /><span>{u.phone || '—'}</span></div>

                  <div className="user-row-role">
                    <span className="role-pill" style={{ background: rc.bg, color: rc.color }}><RoleIcon size={11} /> {rc.label}</span>
                  </div>

                  <div className="user-row-status">
                    {u.isActive
                      ? <span className="status-tag active"><UserCheck size={12} /> Active</span>
                      : <span className="status-tag inactive"><UserX size={12} /> Inactive</span>
                    }
                  </div>

                  <div className="user-row-date"><Calendar size={13} /><span>{formatShortDate(u.createdAt)}</span></div>

                  <div className="user-row-actions" ref={isMenuOpen ? menuRef : null}>
                    <button
                      className={`action-dot-btn ${isMenuOpen ? 'active' : ''}`}
                      onClick={() => setOpenMenuId(isMenuOpen ? null : u._id)}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {isMenuOpen && (
                      <div className="action-menu">
                        <button onClick={() => handleToggleActive(u._id, u.isActive)}>
                          {u.isActive ? <><Ban size={14} /> Deactivate</> : <><UserCheck size={14} /> Activate</>}
                        </button>
                        <div className="menu-divider" />
                        <div className="menu-label">Change Role</div>
                        {['user', 'driver', 'admin'].map((r) => (
                          <button
                            key={r}
                            className={u.role === r ? 'current' : ''}
                            onClick={() => handleRoleChange(u._id, r)}
                          >
                            {r === 'admin' ? <Shield size={14} /> : r === 'driver' ? <Car size={14} /> : <Users size={14} />}
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                            {u.role === r && <Check size={13} className="check-mark" />}
                          </button>
                        ))}
                        <div className="menu-divider" />
                        <button className="danger" onClick={() => handleDelete(u._id)}>
                          <Trash2 size={14} /> Delete User
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {pages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => fetchUsers(page - 1)}><ChevronLeft size={16} /> Prev</button>
              <span className="page-info">Page {page} of {pages}</span>
              <button disabled={page >= pages} onClick={() => fetchUsers(page + 1)}>Next <ChevronRight size={16} /></button>
            </div>
          )}
        </>
      )}

      <style>{`
        /* ========== USERS TAB ========== */
        .user-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: visible;
        }
        .user-row {
          display: grid;
          grid-template-columns: 40px 1.5fr 0.8fr 100px 100px 110px 50px;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
          position: relative;
        }
        .user-row:last-child { border-bottom: none; }
        .user-row:hover { background: var(--surface-muted); }
        .user-row.menu-open { z-index: 300; background: var(--surface); }
        .user-row.disabled { background: var(--surface-muted); }
        .user-row.disabled .user-row-idx,
        .user-row.disabled .user-row-main,
        .user-row.disabled .user-row-phone,
        .user-row.disabled .user-row-role,
        .user-row.disabled .user-row-status,
        .user-row.disabled .user-row-date { opacity: 0.5; }
        .user-row-idx {
          font-size: 0.72rem; font-weight: 700; color: var(--text-muted);
          text-align: center;
        }
        .user-row-main {
          display: flex; align-items: center; gap: 0.75rem; min-width: 0;
        }
        .user-row-avatar {
          width: 38px; height: 38px; border-radius: 12px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white; display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 0.9rem; flex-shrink: 0; overflow: hidden;
        }
        .user-row-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .user-row-info { display: flex; flex-direction: column; min-width: 0; }
        .user-row-name {
          font-weight: 700; font-size: 0.9rem; color: var(--text-primary);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .user-row-email {
          font-size: 0.75rem; color: var(--text-muted);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .user-row-phone {
          display: flex; align-items: center; gap: 0.35rem;
          font-size: 0.82rem; color: var(--text-secondary);
        }
        .user-row-phone svg { color: var(--text-muted); flex-shrink: 0; }
        .role-pill {
          display: inline-flex; align-items: center; gap: 0.25rem;
          padding: 0.22rem 0.55rem; border-radius: 8px;
          font-size: 0.72rem; font-weight: 700; width: fit-content;
        }
        .user-row-status { display: flex; }
        .status-tag {
          display: inline-flex; align-items: center; gap: 0.25rem;
          padding: 0.22rem 0.55rem; border-radius: 8px;
          font-size: 0.72rem; font-weight: 600;
        }
        .status-tag.active { background: #d1fae5; color: #059669; }
        .status-tag.inactive { background: #fee2e2; color: #dc2626; }
        .user-row-date {
          display: flex; align-items: center; gap: 0.35rem;
          font-size: 0.8rem; color: var(--text-muted);
        }
        .user-row-date svg { flex-shrink: 0; }
        .user-row-actions { position: relative; }

        /* Three-dot menu button */
        .action-dot-btn {
          width: 34px; height: 34px; border-radius: 10px;
          border: 1px solid transparent; background: none;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: var(--text-muted); transition: all 0.15s;
        }
        .action-dot-btn:hover { background: var(--surface-muted); color: var(--text-primary); border-color: var(--border); }
        .action-dot-btn.active { background: var(--primary-light); color: var(--primary); border-color: var(--primary); }

        /* Dropdown menu */
        .action-menu {
          position: absolute; right: 0; top: calc(100% + 6px); z-index: 200;
          width: 210px; background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          padding: 0.4rem;
        }
        .action-menu button {
          display: flex; align-items: center; gap: 0.55rem;
          width: 100%; padding: 0.6rem 0.75rem; border-radius: 10px;
          border: none; background: none; cursor: pointer;
          font-size: 0.85rem; font-weight: 500; color: var(--text-secondary);
          transition: all 0.12s; text-align: left; font-family: inherit;
        }
        .action-menu button:hover { background: var(--primary-light); color: var(--primary); }
        .action-menu button.current { color: var(--primary); font-weight: 600; background: var(--primary-light); }
        .action-menu button.danger { color: #ef4444; }
        .action-menu button.danger:hover { background: #fee2e2; color: #dc2626; }
        .check-mark { margin-left: auto; color: var(--primary); }
        .menu-divider { height: 1px; background: var(--border); margin: 0.35rem 0.6rem; }
        .menu-label {
          padding: 0.4rem 0.75rem; font-size: 0.65rem; font-weight: 700;
          color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em;
        }

        @media (max-width: 900px) {
          .user-row { grid-template-columns: 40px 1fr 50px; gap: 0.4rem; }
          .user-row-phone, .user-row-role, .user-row-status, .user-row-date { display: none; }
        }
        @media (max-width: 600px) {
          .user-row { grid-template-columns: 1fr 50px; padding: 0.75rem 1rem; }
          .user-row-idx { display: none; }
        }
      `}</style>
    </motion.div>
  );
};

export default AdminDashboard;
