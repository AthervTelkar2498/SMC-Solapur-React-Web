import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

function Dashboard({ onLogout }) {
  const [stats, setStats] = useState({
    totalProposals: 0,
    completedWork: 0,
    pendingWork: 0,
    avgDays: 0,
    statusBreakdown: [],
    tasksOverTime: []
  });
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeView, setActiveView] = useState('upload');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, proposalsRes] = await Promise.all([
        axios.get('/api/dashboard/stats', { headers }),
        axios.get('/api/proposals?limit=50', { headers })
      ]);

      setStats(statsRes.data.data);
      setProposals(proposalsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setUploadSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/upload/excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUploadSuccess(true);
        setTimeout(() => {
          fetchDashboardData();
          setUploadSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'Error uploading file');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return '#27ae60';
      case 'overdue': return '#e74c3c';
      case 'pending': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const filteredProposals = proposals.filter(p => {
    const matchesSearch = !searchTerm || 
      p.proposal_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pending_by?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !filterStatus || p.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const pieData = stats.statusBreakdown.map(item => ({
    name: item.status,
    value: parseInt(item.count)
  }));

  const COLORS = {
    'Completed': '#4a90e2',
    'Pending': '#f39c12',
    'Overdue': '#e74c3c'
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <div className="logo-small">
            <span>SM</span>
          </div>
          <h1>Solupur Municipal Corporation – Work Management System</h1>
        </div>
        <div className="header-right">
          <span className="language-text">English</span>
          <div className="user-info">
            <div className="user-avatar">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z"/>
                <path d="M10 12.5C5.58172 12.5 2 14.8431 2 17.7273V20H18V17.7273C18 14.8431 14.4183 12.5 10 12.5Z"/>
              </svg>
            </div>
            <span className="user-name">{user.full_name || 'Admin User'}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="sidebar">
          <div className={`sidebar-item ${activeView === 'dashboard' ? 'active' : ''}`} 
               onClick={() => setActiveView('dashboard')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 3h6v6H3V3zm0 8h6v6H3v-6zm8-8h6v6h-6V3zm0 8h6v6h-6v-6z"/>
            </svg>
            <span>Dashboard</span>
          </div>
          <div className={`sidebar-item ${activeView === 'upload' ? 'active' : ''}`} 
               onClick={() => setActiveView('upload')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 0L6 4h3v6h2V4h3l-4-4zm8 14v4H2v-4H0v6h20v-6h-2z"/>
            </svg>
            <span>Upload Excel</span>
          </div>
          <div className="sidebar-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm-1-9V5h2v6h4l-5 5-5-5h4z"/>
            </svg>
            <span>Pending Work</span>
          </div>
          <div className="sidebar-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>Completed Work</span>
          </div>
          <div className="sidebar-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 3h14a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2zm0 2v10h14V5H3z"/>
            </svg>
            <span>Reports & Analytics</span>
          </div>
        </div>

        <div className="main-content">
          <div className="section-header">
            <h2>Serial Proposal</h2>
          </div>

          <div className="stats-cards">
            <div className="stat-card blue">
              <div className="stat-content">
                <div className="stat-label">Total Proposals</div>
                <div className="stat-value">{stats.totalProposals}</div>
              </div>
              <div className="stat-icon">↑</div>
            </div>
            <div className="stat-card blue-light">
              <div className="stat-content">
                <div className="stat-label">Completed Work</div>
                <div className="stat-value">{stats.completedWork}</div>
              </div>
              <div className="stat-icon">↗</div>
            </div>
            <div className="stat-card red">
              <div className="stat-content">
                <div className="stat-label">Pending Work</div>
                <div className="stat-value">{stats.pendingWork}</div>
              </div>
              <div className="stat-icon">↓</div>
            </div>
            <div className="stat-card red-light">
              <div className="stat-content">
                <div className="stat-label">Pending Work</div>
                <div className="stat-value">{stats.pendingWork}</div>
              </div>
              <div className="stat-icon">□</div>
            </div>
            <div className="stat-card gray">
              <div className="stat-content">
                <div className="stat-label">Average Day Count</div>
                <div className="stat-value">{stats.avgDays}</div>
              </div>
              <div className="stat-icon">○</div>
            </div>
          </div>

          <div className="upload-section">
            <input
              type="file"
              id="file-upload"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" className="upload-btn">
              {uploading ? 'Uploading...' : 'Upload Excel'}
            </label>
            {uploadSuccess && (
              <span className="upload-success">✓ File uploaded successfully!</span>
            )}
          </div>

          <div className="filters-section">
            <div className="search-box">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#666">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
            <button className="filter-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M0 2h16v2H0V2zm2 4h12v2H2V6zm4 4h4v2H6v-2z"/>
              </svg>
              Filter
            </button>
          </div>

          <div className="table-container">
            <table className="proposals-table">
              <thead>
                <tr>
                  <th>Sr. no.</th>
                  <th>Assign date</th>
                  <th>Assign date</th>
                  <th>Action date</th>
                  <th>Remark Day courk</th>
                </tr>
              </thead>
              <tbody>
                {filteredProposals.slice(0, 10).map((proposal, index) => (
                  <tr key={proposal.id}>
                    <td>{String(index + 1).padStart(2, '0')}</td>
                    <td>{proposal.proposal_number || 'PROP-001'}</td>
                    <td>{proposal.proposal_code || '-'}</td>
                    <td>{proposal.transaction_date ? new Date(proposal.transaction_date).toISOString().split('T')[0] : '-'}</td>
                    <td>
                      <span className="status-badge" style={{ background: getStatusColor(proposal.status) }}>
                        {proposal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="charts-sidebar">
          <div className="chart-card">
            <h3>Task Status Overview</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#95a5a6'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3>Tasks Over Time</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[
                  { name: 'Muny', value: 5 },
                  { name: 'Juev', value: 8 },
                  { name: 'Janw', value: 3 },
                  { name: 'Juty', value: 10 },
                  { name: 'Jaany', value: 7 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#4a90e2" strokeWidth={2} />
                  <Line type="monotone" dataKey="value" stroke="#e74c3c" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
