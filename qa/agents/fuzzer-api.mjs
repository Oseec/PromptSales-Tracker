import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import fetch from "node-fetch";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Asegurar carpeta de resultados
const resultsDir = path.resolve(__dirname, "../results");
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

const reportPath = path.join(resultsDir, "fuzzer-report.json");

// Valores raros / borde para probar la API
function randomValue() {
  const values = [
    -10000,
    -1,
    0,
    1,
    25,
    999999999,
    "texto",
    "",
    null,
    [],
    {},
    true,
    false,
    Math.random() * 1000,
  ];
  return values[Math.floor(Math.random() * values.length)];
}

// Payload aleatorio, a propósito sin respetar mucho el contrato
function randomPayload() {
  return {
    customer: randomValue(),
    amount: randomValue(),
    paymentMethod: randomValue(),
  };
}

async function runFuzzer(iterations = 30) {
  const targetUrl = "http://localhost:4000/api/sales";
  const results = [];

  console.log(`=== Fuzzer API ===`);
  console.log(`Objetivo: POST ${targetUrl}`);
  console.log(`Iteraciones: ${iterations}\n`);

  for (let i = 0; i < iterations; i++) {
    const payload = randomPayload();
    let entry = { iteration: i + 1, payload };

    try {
      const res = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      entry.status = res.status;

      // Intentar leer JSON si se puede
      try {
        entry.body = await res.json();
      } catch {
        entry.body = null;
      }
    } catch (err) {
      entry.error = err.message;
    }

    results.push(entry);
  }

  // Resumen simple
  const summary = {
    totalRequests: results.length,
    byStatus: {},
    errors: 0,
  };

  for (const r of results) {
    if (r.error) {
      summary.errors++;
      continue;
    }
    const key = String(r.status);
    summary.byStatus[key] = (summary.byStatus[key] || 0) + 1;
  }

  const report = {
    target: targetUrl,
    generatedAt: new Date().toISOString(),
    summary,
    samples: results.slice(0, 10), // no guardamos TODO en detalle, solo muestra
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log("=== Resumen Fuzzer ===");
  console.log(`Total requests: ${summary.totalRequests}`);
  console.log(`Errores de red: ${summary.errors}`);
  console.log("Por status HTTP:", summary.byStatus);
  console.log(`\nReporte guardado en: ${reportPath}`);
}

runFuzzer().catch((err) => {
  console.error("[fuzzer-api] Error inesperado:", err);
  process.exit(1);
});
