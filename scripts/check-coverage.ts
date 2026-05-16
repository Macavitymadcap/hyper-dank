#!/usr/bin/env bun
import { LcovCoverageReport } from "./lib/coverage-report";

const report = new LcovCoverageReport(await Bun.file("coverage/lcov.info").text());

report.assertThresholds({
  functions: 1,
  lines: 0.8,
});

console.log("Coverage thresholds met: 100% functions and 80% lines per file.");
