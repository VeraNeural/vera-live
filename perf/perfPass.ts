export type PerfResult = {
  ok: boolean;
  metrics: Record<string, number>;
};

export async function runPerformancePass(): Promise<PerfResult> {
  const metrics = {
    placeholder: 1,
  };

  return { ok: true, metrics };
}
