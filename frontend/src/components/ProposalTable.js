import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  StatusBadge,
  Pagination,
  PaginationInfo,
  PaginationControls,
  PaginationButton,
  LoadingSpinner,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateMessage
} from '../styles/TableStyles';

const ProposalTable = ({ 
  data, 
  loading, 
  pagination, 
  onPageChange,
  onStatusChange 
}) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>📄</EmptyStateIcon>
        <EmptyStateTitle>No proposals found</EmptyStateTitle>
        <EmptyStateMessage>
          Upload an Excel file to start tracking work proposals and their status.
        </EmptyStateMessage>
      </EmptyState>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd-MM-yyyy');
    } catch {
      return '-';
    }
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { currentPage, totalPages, totalRecords, recordsPerPage } = pagination;
    const startRecord = (currentPage - 1) * recordsPerPage + 1;
    const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

    return (
      <Pagination>
        <PaginationInfo>
          Showing {startRecord} to {endRecord} of {totalRecords} entries
        </PaginationInfo>
        <PaginationControls>
          <PaginationButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </PaginationButton>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <PaginationButton
                key={pageNum}
                className={currentPage === pageNum ? 'active' : ''}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </PaginationButton>
            );
          })}
          
          <PaginationButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </PaginationButton>
        </PaginationControls>
      </Pagination>
    );
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Sr. No.</TableHeaderCell>
            <TableHeaderCell>Proposal No.</TableHeaderCell>
            <TableHeaderCell>Proposal Code</TableHeaderCell>
            <TableHeaderCell>Transaction Date</TableHeaderCell>
            <TableHeaderCell>Service Name</TableHeaderCell>
            <TableHeaderCell>Owner Name</TableHeaderCell>
            <TableHeaderCell>Site Address</TableHeaderCell>
            <TableHeaderCell>Pending By</TableHeaderCell>
            <TableHeaderCell>Designation</TableHeaderCell>
            <TableHeaderCell>Application Received Date</TableHeaderCell>
            <TableHeaderCell>Days</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((proposal, index) => (
            <TableRow key={proposal.id || index}>
              <TableCell>{proposal.sr_no || '-'}</TableCell>
              <TableCell>{proposal.proposal_number || '-'}</TableCell>
              <TableCell>{proposal.proposal_code || '-'}</TableCell>
              <TableCell>{formatDate(proposal.transaction_date)}</TableCell>
              <TableCell style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {proposal.service_name || '-'}
              </TableCell>
              <TableCell>{proposal.owner_name || '-'}</TableCell>
              <TableCell style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {proposal.site_address || '-'}
              </TableCell>
              <TableCell>{proposal.pending_by || '-'}</TableCell>
              <TableCell>{proposal.designation || '-'}</TableCell>
              <TableCell>{formatDate(proposal.application_received_date)}</TableCell>
              <TableCell>{proposal.days_pending || 0}</TableCell>
              <TableCell>
                <StatusBadge status={proposal.status}>
                  {proposal.status || 'pending'}
                </StatusBadge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {renderPagination()}
    </>
  );
};

export default ProposalTable;