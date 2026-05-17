#!/usr/bin/env bun
import path from "node:path";
import ts from "typescript";
import { normalizePath, root } from "./lib/paths";

const configPath = ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.json");

if (!configPath) {
  console.error("Could not find tsconfig.json.");
  process.exit(1);
}

const configFile = ts.readConfigFile(configPath, ts.sys.readFile);

if (configFile.error) {
  printDiagnostics([configFile.error]);
  process.exit(1);
}

const parsedConfig = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  path.dirname(configPath),
  undefined,
  configPath,
);

if (parsedConfig.errors.length > 0) {
  printDiagnostics(parsedConfig.errors);
  process.exit(1);
}

const projectFiles = parsedConfig.fileNames
  .filter((fileName) => !fileName.includes(`${path.sep}node_modules${path.sep}`))
  .sort();

const scriptVersions = new Map(projectFiles.map((fileName) => [fileName, "0"]));
const host: ts.LanguageServiceHost = {
  getCompilationSettings: () => parsedConfig.options,
  getCurrentDirectory: () => root,
  getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
  getDirectories: ts.sys.getDirectories,
  getScriptFileNames: () => projectFiles,
  getScriptSnapshot: (fileName) => {
    const source = ts.sys.readFile(fileName);
    return source === undefined ? undefined : ts.ScriptSnapshot.fromString(source);
  },
  getScriptVersion: (fileName) => scriptVersions.get(fileName) ?? "0",
  readDirectory: ts.sys.readDirectory,
  readFile: ts.sys.readFile,
  useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
  fileExists: ts.sys.fileExists,
};

const languageService = ts.createLanguageService(host, ts.createDocumentRegistry());
const deprecations = projectFiles
  .flatMap((fileName) => languageService.getSuggestionDiagnostics(fileName))
  .filter(isDeprecatedDiagnostic);

languageService.dispose();

if (deprecations.length > 0) {
  console.error("Deprecated TypeScript APIs found:");
  printDiagnostics(deprecations);
  process.exit(1);
}

console.log(`No deprecated TypeScript APIs found in ${projectFiles.length} project files.`);

function isDeprecatedDiagnostic(diagnostic: ts.Diagnostic) {
  return (
    Boolean(diagnostic.reportsDeprecated) || diagnostic.code === 6385 || diagnostic.code === 6387
  );
}

function printDiagnostics(diagnostics: ts.Diagnostic[]) {
  for (const diagnostic of diagnostics) {
    console.error(formatDiagnostic(diagnostic));
  }
}

function formatDiagnostic(diagnostic: ts.Diagnostic) {
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");

  if (!diagnostic.file || diagnostic.start === undefined) {
    return `- ${message}`;
  }

  const position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
  const relativePath = normalizePath(path.relative(root, diagnostic.file.fileName));
  return `- ${relativePath}:${position.line + 1}:${position.character + 1} - ${message}`;
}
