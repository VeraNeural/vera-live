import { runHarnessTests } from "../tests/runtimeHarness";
import { runRegressionChecklist } from "../checks/regressionChecklist";
import { runPerformancePass } from "../perf/perfPass";

async function verifyRuntime() {
  console.log("RW-VERIFY: START");

  // 1) Test Harness
  console.log("TH-01: Running runtime harness tests...");
  const harnessResult = await runHarnessTests();
  if (!harnessResult.ok) {
    console.error("TH-01 FAILED:", harnessResult.errors);
    process.exit(1);
  }
  console.log("TH-01: PASSED");

  // 2) Regression Checklist
  console.log("CR-01: Running regression checklist...");
  const checklistResult = await runRegressionChecklist();
  if (!checklistResult.ok) {
    console.error("CR-01 FAILED:", checklistResult.errors);
    process.exit(1);
  }
  console.log("CR-01: PASSED");

  // 3) Performance Pass
  console.log("PF-01: Running performance checks...");
  const perfResult = await runPerformancePass();
  if (!perfResult.ok) {
    console.error("PF-01 FAILED:", perfResult.metrics);
    process.exit(1);
  }
  console.log("PF-01: PASSED");

  console.log("RW-VERIFY: ALL CHECKS PASSED");
  process.exit(0);
}

verifyRuntime().catch(err => {
  console.error("RW-VERIFY: UNCAUGHT ERROR", err);
  process.exit(1);
});
