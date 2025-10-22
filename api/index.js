export default async function handler(req, res) {
  try {
    const serverModule = await import('../dist/linkSphere/server/server.mjs');
    const app = serverModule.app || serverModule.default?.app || serverModule.default;

    if (!app) {
      throw new Error('SSR app not found in server.mjs');
    }

    return app(req, res);
  } catch (error) {
    console.error('❌ Angular SSR failed to load:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
