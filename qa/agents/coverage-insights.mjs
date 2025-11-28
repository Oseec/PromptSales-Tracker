// qa/agents/coverage-insights.mjs
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

// Como estamos en ESM, calculamos __dirname así
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Posibles rutas donde Vitest deja coverage-summary.json
const candidatePaths = [
  path.resolve(__dirname, "../results/coverage/coverage-summary.json"),
  path.resolve(__dirname, "../../coverage/coverage-summary.json"),
];

let summaryPath = null;

for (const p of candidatePaths) {
  if (fs.existsSync(p)) {
    summaryPath = p;
    break;
  }
}

if (!summaryPath) {
  console.error(
    "[coverage-insights] No se encontró coverage-summary.json.\n" +
      "Asegurate de ejecutar primero: npm run test:unit:coverage\n" +
      "y revisa que exista qa/results/coverage/coverage-summary.json o coverage/coverage-summary.json",
  );
  process.exit(1);
}

const raw = fs.readFileSync(summaryPath, "utf8");
const summary = JSON.parse(raw);

// Tipo aproximado: { total: {...}, "path/archivo.ts": {...}, ... }
const entries = Object.entries(summary).filter(
  ([key]) => key !== "total",
);

if (entries.length === 0) {
  console.log("[coverage-insights] No hay archivos individuales en el coverage.");
  process.exit(0);
}

function classify(linesPct, branchesPct) {
  const minPct = Math.min(linesPct, branchesPct);

  if (minPct < 50) return "alta";
  if (minPct < 80) return "media";
  return "baja";
}

function suggest(linesPct, branchesPct) {
  const minPct = Math.min(linesPct, branchesPct);

  if (minPct < 50) {
    return "Cobertura crítica; agregar tests para casos de error, bordes y ramas condicionales.";
  }
  if (minPct < 80) {
    return "Cobertura mejorable; enfocar nuevos tests en ramas no cubiertas y escenarios menos frecuentes.";
  }
  return "Cobertura aceptable; se pueden priorizar otros módulos con menor cobertura.";
}

const insights = entries.map(([file, data]) => {
  const entry = data || {};
  const linesPct = entry.lines?.pct ?? 0;
  const branchesPct = entry.branches?.pct ?? 0;
  const riskLevel = classify(linesPct, branchesPct);

  return {
    file,
    lines: linesPct,
    branches: branchesPct,
    riskLevel,
    suggestion: suggest(linesPct, branchesPct),
  };
});

// Ordena de menor a mayor cobertura de líneas
insights.sort((a, b) => a.lines - b.lines);

console.log("=== Agente de Cobertura - Insights ===\n");

for (const insight of insights) {
  console.log(`Archivo: ${insight.file}`);
  console.log(`  Cobertura líneas:   ${insight.lines.toFixed(1)} %`);
  console.log(`  Cobertura ramas:    ${insight.branches.toFixed(1)} %`);
  console.log(`  Riesgo:             ${insight.riskLevel}`);
  console.log(`  Sugerencia:         ${insight.suggestion}`);
  console.log("");
}

const worst = insights[0];
console.log("Recomendación prioritaria:");
console.log(
  `  Trabajar primero sobre: ${worst.file} ` +
    `(cobertura de líneas ${worst.lines.toFixed(1)} %).`,
);
