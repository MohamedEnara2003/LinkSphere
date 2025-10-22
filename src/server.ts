import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express, { Request, Response } from 'express';
import {
  AngularNodeAppEngine,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const browserDistFolder = join(__dirname, '../dist/link-sphere/browser'); // 👈 غيّر "link-sphere" لاسم مجلد مشروعك
const angularApp = new AngularNodeAppEngine();

const app = express();

// Serve static files
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Angular SSR handler
app.use(async (req: Request, res: Response, next) => {
  try {
    const response = await angularApp.handle(req);
    if (response) {
      writeResponseToNodeResponse(response, res);
    } else {
      next();
    }
  } catch (err) {
    console.error('SSR error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// ✅ Vercel-compatible handler
export default function handler(req: Request, res: Response): void {
  app(req, res);
}
