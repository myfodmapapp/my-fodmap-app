import { PaddleOCR } from "@paddleocr/paddleocr-js";

let enginePromise;

async function getEngine() {
  if (!enginePromise) {
    enginePromise = PaddleOCR.create({
      lang: "en",
      ocrVersion: "PP-OCRv5",
      ortOptions: {
        backend: "wasm",
        wasmPaths: "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/",
        numThreads: 1,
        simd: true
      }
    });
  }

  return enginePromise;
}

window.myFodmapPaddleOCR = async function (image) {
  const engine = await getEngine();

  const [result] = await engine.predict(image, {
    textDetLimitSideLen: 1600,
    textDetBoxThresh: 0.45,
    textRecScoreThresh: 0.35
  });

  if (!result || !Array.isArray(result.items)) {
    throw new Error("PP-OCRv5 returned no OCR items");
  }

  return result;
};

// Preload after first paint.
// If PP-OCRv5 fails to load, My FODMAP can still use
// the existing backup OCR instead of blocking the scanner.
window.addEventListener("load", () => {
  setTimeout(() => {
    getEngine().catch(err =>
      console.warn("PP-OCRv5 preload failed:", err)
    );
  }, 600);
});
