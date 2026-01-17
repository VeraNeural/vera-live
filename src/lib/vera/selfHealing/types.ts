export type HealthStatus = 'healthy' | 'warning' | 'critical';
export type OverallStatus = 'healthy' | 'degraded' | 'down';

export type ErrorLog = {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  stack?: string;
  file?: string;
  resolved: boolean;
  fix?: AutoFix;
};

export type HealthCheck = {
  id: string;
  name: string;
  status: HealthStatus;
  lastCheck: string;
  message: string;
};

export type AutoFix = {
  id: string;
  errorType: string;
  fix: {
    kind: 'sql' | 'create_bucket' | 'alert_admin' | 'retry_strategy' | 'manual';
    title: string;
    details: string;
    sql?: string;
    bucketName?: string;
  };
  applied: boolean;
  appliedAt?: string;
  success: boolean;
};

export type SystemStatus = {
  overall: OverallStatus;
  checks: HealthCheck[];
  recentErrors: ErrorLog[];
};
