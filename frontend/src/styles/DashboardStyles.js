import styled from 'styled-components';

export const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
`;

export const Sidebar = styled.aside`
  width: 280px;
  background: linear-gradient(180deg, #2d3748 0%, #1a202c 100%);
  color: white;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 1000;
`;

export const SidebarHeader = styled.div`
  padding: 25px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SidebarLogo = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: white;
`;

export const SidebarTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: white;
`;

export const SidebarNav = styled.nav`
  padding: 20px 0;
`;

export const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: ${props => props.active ? '#ffffff' : '#a0aec0'};
  background: ${props => props.active ? 'rgba(59, 130, 246, 0.2)' : 'transparent'};
  border-right: ${props => props.active ? '3px solid #3b82f6' : '3px solid transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '500'};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const MainContent = styled.main`
  margin-left: 280px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const TopBar = styled.header`
  background: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const LanguageSelector = styled.div`
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #64748b;
  font-size: 14px;
`;

export const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
`;

export const LogoutButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #dc2626;
  }
`;

export const ContentArea = styled.div`
  padding: 30px;
  flex: 1;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

export const StatCard = styled.div`
  background: ${props => props.color || '#3b82f6'};
  color: white;
  padding: 25px 20px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(30px, -30px);
  }
`;

export const StatLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
  margin-bottom: 8px;
`;

export const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
`;

export const StatTrend = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  opacity: 0.9;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const ChartHeader = styled.div`
  margin-bottom: 20px;
`;

export const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
`;

export const ChartSubtitle = styled.p`
  font-size: 14px;
  color: #64748b;
`;

export const TableSection = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 25px;
  border-bottom: 1px solid #e2e8f0;
  gap: 20px;
`;

export const TableTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
`;

export const TableControls = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
`;

export const UploadButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    transform: translateY(-1px);
  }
`;

export const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  width: 200px;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;