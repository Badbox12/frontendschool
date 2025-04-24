export interface LogEntry {
    _id: string;
    adminId: string;
    action: string;
    details?: string;
    timestamp: string;
  }