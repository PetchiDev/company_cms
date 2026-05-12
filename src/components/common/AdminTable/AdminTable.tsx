import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import './AdminTable.css';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  actions?: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void;
  title?: string;
  searchPlaceholder?: string;
  expandable?: (item: T) => React.ReactNode;
}

export function AdminTable<T extends { id: string | number }>({
  data,
  columns,
  pageSize = 10,
  actions,
  onRowClick,
  title,
  searchPlaceholder = 'Search records...',
  expandable,
}: AdminTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | null; direction: 'asc' | 'desc' | null }>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [expandedRows, setExpandedRows] = useState<Record<string | number, boolean>>({});

  const toggleRow = (id: string | number) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  /* Handle Sorting */
  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  /* Handle Filter Change */
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  /* Filter & Sort Logic */
  const processedData = useMemo(() => {
    let filtered = [...data];

    /* Global Search */
    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    /* Column Filters */
    Object.keys(filters).forEach(key => {
      const filterVal = filters[key].toLowerCase();
      if (filterVal) {
        filtered = filtered.filter(item => {
          const val = (item as any)[key];
          return String(val).toLowerCase().includes(filterVal);
        });
      }
    });

    /* Sorting */
    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        const aVal = (a as any)[sortConfig.key!];
        const bVal = (b as any)[sortConfig.key!];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig, filters]);

  /* Pagination Logic */
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="admin-table-container slide-in-up">
      <div className="admin-table-header">
        {title && <h2 className="admin-table-title">{title}</h2>}
        <div className="admin-table-search">
          <Search size={18} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              {expandable && <th style={{ width: '50px' }} />}
              {columns.map((col, idx) => (
                <th key={idx} style={{ width: col.width }}>
                  <div className="th-content">
                    <div 
                      className={`th-label ${col.sortable ? 'sortable' : ''}`}
                      onClick={() => col.sortable && handleSort(col.accessor as keyof T)}
                    >
                      {col.header}
                      {col.sortable && (
                        <span className="sort-icon">
                          {sortConfig.key === col.accessor ? (
                            sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                          ) : (
                            <ArrowUpDown size={14} />
                          )}
                        </span>
                      )}
                    </div>
                    {col.filterable && typeof col.accessor === 'string' && (
                      <input
                        type="text"
                        placeholder={`Filter ${col.header}...`}
                        className="column-filter"
                        value={filters[col.accessor as string] || ''}
                        onChange={(e) => handleFilterChange(col.accessor as string, e.target.value)}
                      />
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => {
                const isExpanded = !!expandedRows[item.id];
                return (
                  <React.Fragment key={item.id}>
                    <tr 
                      onClick={() => {
                        if (expandable) toggleRow(item.id);
                        onRowClick?.(item);
                      }} 
                      className={onRowClick || expandable ? 'clickable' : ''}
                    >
                      {expandable && (
                        <td onClick={(e) => e.stopPropagation()}>
                          <button 
                            type="button"
                            className={`expand-btn ${isExpanded ? 'expanded' : ''}`} 
                            onClick={() => toggleRow(item.id)}
                          >
                            <ChevronRight size={16} />
                          </button>
                        </td>
                      )}
                      {columns.map((col, idx) => (
                        <td key={idx}>
                          {typeof col.accessor === 'function'
                            ? col.accessor(item)
                            : (item as any)[col.accessor as string]}
                        </td>
                      ))}
                      {actions && (
                        <td className="text-right" onClick={(e) => e.stopPropagation()}>
                          {actions(item)}
                        </td>
                      )}
                    </tr>
                    {expandable && isExpanded && (
                      <tr className="expandable-row">
                        <td colSpan={columns.length + (actions ? 1 : 0) + 1}>
                          {expandable(item)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0) + (expandable ? 1 : 0)} className="empty-state">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="admin-table-footer">
          <p className="pagination-info">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length}
          </p>
          <div className="pagination-controls">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="pagination-btn"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="pagination-pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`page-num ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="pagination-btn"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
