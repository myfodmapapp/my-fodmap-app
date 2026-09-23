import { PaddleOCR } from "@paddleocr/paddleocr-js";

let enginePromise;

async function getEngine() {
  if (!enginePromise) {
    enginePromise = PaddleOCR.create({
      lang: "en",
      ocrVersion: "PP-OCRv5",
      worker: true,
      ortOptions: {
        backend: "wasm",
        numThreads: 2,
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

  return result;
};

// Start loading after the page becomes interactive,
// without slowing down the initial app screen.
window.addEventListener("load", () => {
  setTimeout(() => {
    getEngine().catch(err =>
      console.warn("PP-OCRv5 preload:", err)
    );
  }, 400);
});
