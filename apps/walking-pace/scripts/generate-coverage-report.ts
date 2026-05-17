#!/usr/bin/env bun
import { writeCoverageHtmlReport } from "./lib/coverage-report";

const outputPath = await writeCoverageHtmlReport();
console.log(`Coverage report written to ${outputPath}`);
