import type { SystemStatus } from './types';
import { runAllChecks } from './healthChecks';
import { getRecentErrors } from './errorMonitor';

export async function generateHealthSummary(): Promise<string> {
  const status = await runAllChecks();
  const lines: string[] = [];

  lines.push(`Overall: ${status.overall.toUpperCase()}`);
  for (const c of status.checks) {
    lines.push(`- ${c.name}: ${c.status.toUpperCase()} — ${c.message}`);
  }

  return lines.join('\n');
}

export async function generateDailyReport(): Promise<string> {
  const status: SystemStatus = await runAllChecks();
  const errors = await getRecentErrors(25).catch(() => []);

  const lines: string[] = [];
  lines.push(`VERA Self-Healing Daily Report`);
  lines.push(`Date: ${new Date().toISOString().slice(0, 10)}`);
  lines.push('');

  lines.push(`Overall: ${status.overall.toUpperCase()}`);
  lines.push('Checks:');
  for (const c of status.checks) {
    lines.push(`- ${c.name}: ${c.status.toUpperCase()} — ${c.message}`);
  }

  lines.push('');
  lines.push(`Recent errors (${errors.length}):`);
  for (const e of errors.slice(0, 10)) {
    const loc = e.file ? ` (${e.file})` : '';
    lines.push(`- ${e.type}: ${e.message}${loc} @ ${e.timestamp}${e.resolved ? ' [resolved]' : ''}`);
  }

  return lines.join('\n');
}

export async function alertAdmin(message: string): Promise<void> {
  // Placeholder for email/SMS/Slack.
  console.warn('[selfHealing] ALERT:', message);
}
