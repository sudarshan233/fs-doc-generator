import { mkdir, readdir, readFile, access } from 'node:fs/promises';
import { basename, join } from 'node:path';

import { mergeApplicationConfig } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';

import { App } from '../app/app';
import { config as serverAppConfig } from '../app/app.config.server';
import { GeneratePayload, HblItem } from '../app/models/generate-payload';
import { GeneratePayloadService } from '../app/services/generate-payload.service';
import { TemplateApp } from '../app/template-app';
import { TemplatePayload } from '../app/models/template-payload';
import { TemplatePayloadService } from '../app/services/template-payload.service';

export interface GeneratedPdfFile {
  fileName: string;
  relativePath: string;
}

export interface GeneratedPdfBatchResult {
  files: GeneratedPdfFile[];
}

const outputDir = join(process.cwd(), 'output');
const sourceRoot = process.cwd();
const baseStylesPath = join(sourceRoot, 'src', 'server', 'pdf-base.css');

let compiledStylesPromise: Promise<string> | null = null;
let assetMapPromise: Promise<Map<string, string>> | null = null;

type PageLike = {
  setContent: (html: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }) => Promise<void>;
  emulateMedia: (options: { media: 'screen' | 'print' }) => Promise<void>;
  pdf: (options: {
    path: string;
    format: 'A4';
    printBackground: boolean;
    preferCSSPageSize: boolean;
    margin: { top: string; right: string; bottom: string; left: string };
  }) => Promise<Uint8Array>;
  close: () => Promise<void>;
};

type BrowserLike = {
  newPage: () => Promise<PageLike>;
  close: () => Promise<void>;
};

type PlaywrightModule = {
  chromium: {
    executablePath: () => string;
    launch: (options: { headless: boolean; executablePath?: string }) => Promise<BrowserLike>;
  };
};

const loadPlaywright = async (): Promise<PlaywrightModule> =>
  Function('return import("playwright")')() as Promise<PlaywrightModule>;

const sanitizeFileName = (value: string): string => {
  const cleaned = value
    .trim()
    .replace(/\.[^.]+$/u, '')
    .replace(/[^a-z0-9-_]+/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  return cleaned || 'document';
};

const getUniquePdfPath = async (requestedFileName: string): Promise<string> => {
  await mkdir(outputDir, { recursive: true });

  const safeBaseName = sanitizeFileName(requestedFileName);
  let suffix = 0;

  while (true) {
    const fileName = suffix === 0 ? `${safeBaseName}.pdf` : `${safeBaseName}-${suffix}.pdf`;
    const filePath = join(outputDir, fileName);

    try {
      await access(filePath);
      suffix += 1;
    } catch {
      return filePath;
    }
  }
};

const collectCssFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const discovered: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      discovered.push(...(await collectCssFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.css')) {
      discovered.push(fullPath);
    }
  }

  return discovered;
};

const loadComponentStyles = async (): Promise<string> => {
  const cssFiles = await collectCssFiles(join(sourceRoot, 'src', 'app'));
  const cssContents = await Promise.all(cssFiles.map((filePath) => readFile(filePath, 'utf8')));

  return cssContents.filter(Boolean).join('\n');
};

const compileGlobalStyles = async (): Promise<string> => {
  let result: string;

  try {
    result = await readFile(baseStylesPath, 'utf8');
  } catch (error) {
    throw new Error(
      `Missing generated PDF stylesheet at ${baseStylesPath}. Run the Tailwind CSS build step first.`,
      { cause: error as Error },
    );
  }

  const componentStyles = await loadComponentStyles();

  return [
    result,
    componentStyles,
    '@page { size: A4; margin: 0; }',
    'html, body { margin: 0; padding: 0; }',
    '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }',
  ].join('\n');
};

const getCompiledStyles = async (): Promise<string> => {
  compiledStylesPromise ??= compileGlobalStyles();
  return compiledStylesPromise;
};

const buildAssetMap = async (): Promise<Map<string, string>> => {
  const assetDir = join(sourceRoot, 'public', 'assets');
  const entries = await readdir(assetDir, { withFileTypes: true });
  const assets = new Map<string, string>();

  await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .map(async (entry) => {
        const filePath = join(assetDir, entry.name);
        const fileContents = await readFile(filePath);
        const mimeType = entry.name.toLowerCase().endsWith('.png') ? 'image/png' : 'application/octet-stream';

        assets.set(`/assets/${entry.name}`, `data:${mimeType};base64,${fileContents.toString('base64')}`);
      }),
  );

  return assets;
};

const getAssetMap = async (): Promise<Map<string, string>> => {
  assetMapPromise ??= buildAssetMap();
  return assetMapPromise;
};

const inlineAssets = async (html: string): Promise<string> => {
  const assetMap = await getAssetMap();
  let output = html;

  for (const [assetPath, dataUri] of assetMap.entries()) {
    output = output.split(assetPath).join(dataUri);
  }

  return output;
};

const buildDocumentShell = (styles: string): string => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>${styles}</style>
</head>
<body>
  <app-root></app-root>
</body>
</html>`;

const buildFileName = (
  payload: GeneratePayload,
  hbl: NonNullable<GeneratePayload['hbl_list']>[number],
  index: number,
): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const documentLabel = sanitizeFileName(
    hbl.sea_waybill_no ?? hbl.carrier_reference ?? hbl.export_reference ?? `document-${index + 1}`,
  );
  const masterBill = sanitizeFileName(payload.mbl_number ?? 'mbl');

  return `${masterBill}-${String(index + 1).padStart(2, '0')}-${documentLabel}-${timestamp}.pdf`;
};

const canAccessPath = async (targetPath: string): Promise<boolean> => {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const collectSystemBrowserCandidates = (): string[] => {
  const candidates = new Set<string>();
  const push = (value: string | undefined): void => {
    if (value) {
      candidates.add(value);
    }
  };

  if (process.platform === 'win32') {
    const programFiles = process.env['PROGRAMFILES'];
    const programFilesX86 = process.env['PROGRAMFILES(X86)'];
    const localAppData = process.env['LOCALAPPDATA'];

    push(programFiles ? join(programFiles, 'Google', 'Chrome', 'Application', 'chrome.exe') : undefined);
    push(programFilesX86 ? join(programFilesX86, 'Google', 'Chrome', 'Application', 'chrome.exe') : undefined);
    push(localAppData ? join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe') : undefined);
    push(programFiles ? join(programFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe') : undefined);
    push(programFilesX86 ? join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe') : undefined);
    push(localAppData ? join(localAppData, 'Microsoft', 'Edge', 'Application', 'msedge.exe') : undefined);
  } else if (process.platform === 'darwin') {
    push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
    push('/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge');
  } else {
    push('/usr/bin/google-chrome');
    push('/usr/bin/google-chrome-stable');
    push('/usr/bin/chromium-browser');
    push('/usr/bin/chromium');
    push('/usr/bin/microsoft-edge');
  }

  return [...candidates];
};

const resolveBrowserExecutablePath = async (chromium: PlaywrightModule['chromium']): Promise<string> => {
  const candidates = [
    process.env['PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH'],
    chromium.executablePath(),
    ...collectSystemBrowserCandidates(),
  ].filter((value): value is string => Boolean(value));

  for (const executablePath of candidates) {
    if (await canAccessPath(executablePath)) {
      return executablePath;
    }
  }

  throw new Error(
    'No Chromium browser executable was found. Install Playwright Chromium with "npx playwright install chromium", install Chrome or Edge, or set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH.',
  );
};

const renderPayloadHtml = async (payload: GeneratePayload): Promise<string> => {
  const styles = await getCompiledStyles();
  const payloadService = new GeneratePayloadService();
  payloadService.setPayload(payload);
  const document = buildDocumentShell(styles);
  const serverConfigWithPayload = mergeApplicationConfig(serverAppConfig, {
    providers: [{ provide: GeneratePayloadService, useValue: payloadService }],
  });

  const rendered = await renderApplication(
    (context) => bootstrapApplication(App, serverConfigWithPayload, context),
    { document },
  );

  return inlineAssets(rendered);
};

const saveRenderedPdf = async (
  browser: BrowserLike,
  payload: GeneratePayload,
  hbl: NonNullable<GeneratePayload['hbl_list']>[number],
  index: number,
): Promise<GeneratedPdfFile> => {
  const page = await browser.newPage();

  try {
    const renderedHtml = await renderPayloadHtml({
      ...payload,
      hbl_list: [hbl],
    });
    const filePath = await getUniquePdfPath(buildFileName(payload, hbl, index));

    await page.setContent(renderedHtml, { waitUntil: 'load' });
    await page.emulateMedia({ media: 'screen' });
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    return {
      fileName: basename(filePath),
      relativePath: `output/${basename(filePath)}`,
    };
  } finally {
    await page.close();
  }
};

export const generatePdfDocuments = async (payload: GeneratePayload): Promise<GeneratedPdfBatchResult> => {
  if (!payload.hbl_list?.length) {
    throw new Error('hbl_list is required');
  }

  const { chromium } = await loadPlaywright();
  const executablePath = await resolveBrowserExecutablePath(chromium);
  const browser = await chromium.launch({
    headless: true,
    executablePath,
  });

  try {
    const files: GeneratedPdfFile[] = [];

    for (let index = 0; index < payload.hbl_list.length; index += 1) {
      const hbl = payload.hbl_list[index];
      if (!hbl) {
        continue;
      }

      const savedFile = await saveRenderedPdf(browser, payload, hbl, index);
      files.push(savedFile);
    }

    return { files };
  } finally {
    await browser.close();
  }
};

const buildTemplateFileName = (payload: TemplatePayload): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${sanitizeFileName(payload.filename)}-${timestamp}.pdf`;
};

const renderTemplateHtmlContent = async (payload: TemplatePayload): Promise<string> => {
  const styles = await getCompiledStyles();
  const payloadService = new TemplatePayloadService();
  payloadService.setPayload(payload);
  
  const document = buildDocumentShell(styles).replace('<app-root></app-root>', '<app-template-root></app-template-root>');
  const serverConfigWithPayload = mergeApplicationConfig(serverAppConfig, {
    providers: [{ provide: TemplatePayloadService, useValue: payloadService }],
  });

  const rendered = await renderApplication(
    (context) => bootstrapApplication(TemplateApp, serverConfigWithPayload, context),
    { document },
  );

  return inlineAssets(rendered);
};

export const generateDocFromTemplate = async (payload: TemplatePayload): Promise<GeneratedPdfFile> => {
  if (!payload || !payload.template_type) {
    throw new Error('Template payload missing required fields');
  }

  const { chromium } = await loadPlaywright();
  const executablePath = await resolveBrowserExecutablePath(chromium);
  const browser = await chromium.launch({
    headless: true,
    executablePath,
  });

  try {
    const page = await browser.newPage();
    try {
      const renderedHtml = await renderTemplateHtmlContent(payload);
      const filePath = await getUniquePdfPath(buildTemplateFileName(payload));

      await page.setContent(renderedHtml, { waitUntil: 'load' });
      await page.emulateMedia({ media: 'screen' });
      await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });

      return {
        fileName: basename(filePath),
        relativePath: `output/${basename(filePath)}`,
      };
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
};
