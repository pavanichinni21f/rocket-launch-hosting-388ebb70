export interface DataItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  metadata: Record<string, any>;
}

export interface TableFilters {
  status?: string[];
  category?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  search?: string;
}

export interface TableSort {
  id: string;
  desc: boolean;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface FormData {
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  attachments?: File[];
  richContent?: string;
}