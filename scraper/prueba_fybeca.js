const { chromium } = require('playwright');

(async () => {
  // 1. Lanzar el navegador en modo visible (headless: false) para ver la acción
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  console.log("Navegando a la página web de Fybeca...");
  
  // 2. Ir a la URL principal de Fybeca
  // 'domcontentloaded' es suficiente y más rápido si solo queremos el título
  await page.goto('https://www.fybeca.com/', { waitUntil: 'domcontentloaded' });

  // 3. Extraer el título de la página web
  const tituloWeb = await page.title();
  
  console.log("\n==================================================");
  console.log(`¡Éxito! El título de la web es: "${tituloWeb}"`);
  console.log("==================================================\n");

  // 4. Pausa de 2 segundos antes de cerrar para verificar visualmente
  await page.waitForTimeout(2000);
  await browser.close();
})();