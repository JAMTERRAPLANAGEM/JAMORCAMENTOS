import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");

test("instalação JAM não reutiliza infraestrutura nem identidade da Alpha", () => {
  const sources = [
    read("../src/App.jsx"),
    read("../src/services/googleDriveStore.js"),
    read("../src/services/orcamentoStore.js"),
    read("../src/propostas/alphaProposal.js"),
    read("../src/config/brand.js"),
    read("../vite.config.js"),
  ].join("\n");

  for (const forbidden of [
    "alphaorc-d3667",
    "376035181065",
    "AlphaOrcamentos",
    "alphaorc-google-client-id",
    "ALPHA ENGENHARIA E SERVIÇOS",
    "Rua José Da Costa",
    "52.903.822/0001-86",
  ]) {
    assert.equal(sources.includes(forbidden), false, `referência proibida encontrada: ${forbidden}`);
  }

  assert.match(sources, /JAMOrcamentos/);
  assert.match(sources, /JAM TERRAPLANAGEM/);
  assert.match(sources, /31985759622/);
});
