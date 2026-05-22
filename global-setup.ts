function globalSetup(): void {
  const hasApiKey = Boolean(process.env.REQRES_API_KEY?.trim());

  if (!hasApiKey) {
    process.env.REQRES_USE_MOCK = 'true';
    console.warn(
      '[reqres-tests] REQRES_API_KEY not set — using local mock server (POST echo + GET fixture id=2).',
    );
    console.warn('[reqres-tests] For live API: set REQRES_API_KEY in .env (https://app.reqres.in/api-keys)');
  }
}

export default globalSetup;
