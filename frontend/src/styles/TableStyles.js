import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: #f8fafc;
`;

export const TableBody = styled.tbody`
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  
  &:hover {
    background: #f8fafc;
  }
`;

export const TableHeaderCell = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
  color: #374151;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  vertical-align: middle;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.status) {
      case 'completed':
        return `
          background: #dcfce7;
          color: #166534;
        `;
      case 'pending':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case 'overdue':
        return `
          background: #fecaca;
          color: #991b1b;
        `;
      default:
        return `
          background: #e5e7eb;
          color: #374151;
        `;
    }
  }}
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 20px 25px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
`;

export const PaginationInfo = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

export const PaginationControls = styled.div`
  display: flex;
  gap: 8px;
`;

export const PaginationButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  
  &::after {
    content: '';
    width: 32px;
    height: 32px;
    border: 3px solid #e5e7eb;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

export const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

export const EmptyStateMessage = styled.p`
  font-size: 14px;
  color: #6b7280;
  max-width: 400px;
  margin: 0 auto;
`;