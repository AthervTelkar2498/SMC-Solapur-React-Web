import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
  Home,
  Upload,
  Clock,
  CheckSquare,
  BarChart3,
  FileText,
  LogOut,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService, proposalService } from '../services/api';
import ProposalTable from '../components/ProposalTable';
import ExcelUploadModal from '../components/ExcelUploadModal';
import {
  DashboardContainer,
  Sidebar,
  SidebarHeader,
  SidebarLogo,
  SidebarTitle,
  SidebarNav,
  NavItem,
  MainContent,
  TopBar,
  PageTitle,
  UserSection,
  LanguageSelector,
  UserInfo,
  UserAvatar,
  LogoutButton,
  ContentArea,
  StatsGrid,
  StatCard,
  StatLabel,
  StatValue,
  StatTrend,
  ChartsSection,
  ChartCard,
  ChartHeader,
  ChartTitle,
  ChartSubtitle,
  TableSection,
  TableHeader,
  TableTitle,
  TableControls,
  UploadButton,
  SearchInput,
  FilterSelect
} from '../styles/DashboardStyles';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'pending' || activeTab === 'completed') {
      loadProposals();
    }
  }, [activeTab, filters]);

  const loadDashboardData = async () => {
    try {
      const stats = await dashboardService.getStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const loadProposals = async () => {
    setLoading(true);
    try {
      const filterParams = { ...filters };
      if (activeTab === 'pending') {
        filterParams.status = 'pending';
      } else if (activeTab === 'completed') {
        filterParams.status = 'completed';
      }
      
      const response = await proposalService.getAll(filterParams);
      setProposals(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    loadDashboardData();
    if (activeTab !== 'dashboard') {
      loadProposals();
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleLogout = async () => {
    await logout();
  };

  const getNavItems = () => [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'upload', label: 'Upload Excel', icon: Upload },
    { id: 'pending', label: 'Pending Work', icon: Clock },
    { id: 'completed', label: 'Completed Work', icon: CheckSquare },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 }
  ];

  const renderDashboardStats = () => {
    if (!dashboardStats) return null;

    const { summary } = dashboardStats;

    return (
      <StatsGrid>
        <StatCard color="#3b82f6">
          <StatLabel>Total Proposals</StatLabel>
          <StatValue>{summary.totalProposals}</StatValue>
          <StatTrend>
            <ArrowUp size={16} />
            Total count
          </StatTrend>
        </StatCard>

        <StatCard color="#10b981">
          <StatLabel>Completed Work</StatLabel>
          <StatValue>{summary.completedWork}</StatValue>
          <StatTrend>
            <TrendingUp size={16} />
            Work done
          </StatTrend>
        </StatCard>

        <StatCard color="#f59e0b">
          <StatLabel>Pending Work</StatLabel>
          <StatValue>{summary.pendingWork}</StatValue>
          <StatTrend>
            <TrendingDown size={16} />
            In progress
          </StatTrend>
        </StatCard>

        <StatCard color="#ef4444">
          <StatLabel>Overdue Work</StatLabel>
          <StatValue>{summary.overdueWork}</StatValue>
          <StatTrend>
            <ArrowDown size={16} />
            Delayed
          </StatTrend>
        </StatCard>

        <StatCard color="#8b5cf6">
          <StatLabel>Average Day Count</StatLabel>
          <StatValue>{summary.averageDays}</StatValue>
          <StatTrend>
            <Clock size={16} />
            Processing time
          </StatTrend>
        </StatCard>
      </StatsGrid>
    );
  };

  const renderCharts = () => {
    if (!dashboardStats) return null;

    const pieData = dashboardStats.statusDistribution?.map(item => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      value: parseInt(item.count),
      percentage: parseFloat(item.percentage)
    })) || [];

    const lineData = dashboardStats.monthlyTrends?.map(item => ({
      month: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
      total: parseInt(item.total_count),
      completed: parseInt(item.completed_count),
      pending: parseInt(item.pending_count)
    })) || [];

    return (
      <ChartsSection>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Task Status Overview</ChartTitle>
            <ChartSubtitle>Distribution of task status</ChartSubtitle>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.percentage}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>Tasks Over Time</ChartTitle>
            <ChartSubtitle>Monthly task completion trends</ChartSubtitle>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Total"
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Completed"
              />
              <Line 
                type="monotone" 
                dataKey="pending" 
                stroke="#f59e0b" 
                strokeWidth={3}
                name="Pending"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsSection>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            {renderDashboardStats()}
            {renderCharts()}
            <TableSection>
              <TableHeader>
                <TableTitle>Serial Proposal</TableTitle>
                <TableControls>
                  <UploadButton onClick={() => setShowUploadModal(true)}>
                    Upload Excel
                  </UploadButton>
                  <SearchInput
                    placeholder="Search"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                  <FilterSelect
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">Filter</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </FilterSelect>
                </TableControls>
              </TableHeader>
              <ProposalTable
                data={proposals}
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </TableSection>
          </div>
        );

      case 'upload':
        return (
          <div>
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📄</div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' }}>
                Upload Excel File
              </h2>
              <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
                Upload your Excel file containing work proposals to track and manage them effectively.
              </p>
              <UploadButton onClick={() => setShowUploadModal(true)}>
                Choose Excel File
              </UploadButton>
            </div>
          </div>
        );

      case 'pending':
      case 'completed':
        return (
          <TableSection>
            <TableHeader>
              <TableTitle>
                {activeTab === 'pending' ? 'Pending Work' : 'Completed Work'}
              </TableTitle>
              <TableControls>
                <SearchInput
                  placeholder="Search"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </TableControls>
            </TableHeader>
            <ProposalTable
              data={proposals}
              loading={loading}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </TableSection>
        );

      case 'reports':
        return (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#1e293b' }}>
              Reports & Analytics
            </h2>
            {renderDashboardStats()}
            {renderCharts()}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarHeader>
          <SidebarLogo>SM</SidebarLogo>
          <SidebarTitle>Admin Panel</SidebarTitle>
        </SidebarHeader>
        
        <SidebarNav>
          {getNavItems().map(item => (
            <NavItem
              key={item.id}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon />
              {item.label}
            </NavItem>
          ))}
        </SidebarNav>
      </Sidebar>

      <MainContent>
        <TopBar>
          <PageTitle>
            {activeTab === 'dashboard' ? 'Serial Proposal' : 
             activeTab === 'upload' ? 'Upload Excel' :
             activeTab === 'pending' ? 'Pending Work' :
             activeTab === 'completed' ? 'Completed Work' :
             'Reports & Analytics'}
          </PageTitle>
          
          <UserSection>
            <LanguageSelector>English</LanguageSelector>
            <UserInfo>
              <UserAvatar>
                {user?.username?.charAt(0)?.toUpperCase() || 'A'}
              </UserAvatar>
              <span>Admin User</span>
            </UserInfo>
            <LogoutButton onClick={handleLogout}>
              Logout
            </LogoutButton>
          </UserSection>
        </TopBar>

        <ContentArea>
          {renderContent()}
        </ContentArea>
      </MainContent>

      <ExcelUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </DashboardContainer>
  );
};

export default Dashboard;