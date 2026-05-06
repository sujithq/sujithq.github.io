import { test, expect } from '@playwright/test';
import { spawn, type ChildProcess } from 'node:child_process';

const LOCAL_PROD_URL = 'http://127.0.0.1:1234';
const STARTUP_MARKER = `Serving public at ${LOCAL_PROD_URL}`;

let serverProcess: ChildProcess | null = null;

async function waitForServerReady(): Promise<void> {
  await expect
    .poll(async () => {
      try {
        const response = await fetch(LOCAL_PROD_URL);
        return response.status;
      } catch {
        return 0;
      }
    }, {
      timeout: 120_000,
      intervals: [500, 1000, 2000],
    })
    .toBe(200);
}

function stopServer(processToStop: ChildProcess | null): Promise<void> {
  return new Promise((resolve) => {
    if (!processToStop || !processToStop.pid) {
      resolve();
      return;
    }

    if (process.platform === 'win32') {
      const killer = spawn('taskkill', ['/pid', String(processToStop.pid), '/t', '/f'], {
        stdio: 'ignore',
      });
      killer.on('exit', () => resolve());
      killer.on('error', () => resolve());
      return;
    }

    processToStop.once('exit', () => resolve());
    processToStop.kill('SIGTERM');
  });
}

test.describe('Local Production Health', () => {
  test.beforeAll(async () => {
    serverProcess = spawn('npm run serve:prod-local', {
      shell: true,
      windowsHide: true,
      env: process.env,
    });

    const startupPromise = new Promise<void>((resolve, reject) => {
      let logs = '';

      serverProcess?.stdout?.on('data', (chunk: Buffer | string) => {
        const text = chunk.toString();
        logs += text;
        if (text.includes(STARTUP_MARKER)) {
          resolve();
        }
      });

      serverProcess?.stderr?.on('data', (chunk: Buffer | string) => {
        logs += chunk.toString();
      });

      serverProcess?.once('exit', (code) => {
        reject(new Error(`serve:prod-local exited before startup (code ${code}). Logs:\n${logs}`));
      });
    });

    await startupPromise;
    await waitForServerReady();
  });

  test.afterAll(async () => {
    await stopServer(serverProcess);
    serverProcess = null;
  });

  test('Homepage responds and renders key landmarks', async ({ page }) => {
    await test.step('Open local production homepage', async () => {
      await page.goto(LOCAL_PROD_URL, { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(`${LOCAL_PROD_URL}/`);
    });

    await test.step('Validate page-level health signals', async () => {
      await expect(page).toHaveTitle(/Sujith Quintelier/i);
      await expect(page.getByRole('banner')).toBeAttached();
      await expect(page.getByRole('main')).toBeAttached();
      await expect(page.getByRole('contentinfo')).toBeAttached();
    });
  });
});
