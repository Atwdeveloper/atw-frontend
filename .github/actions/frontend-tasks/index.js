'use strict';

// Azure login is supplied by azure/login in each workflow job.
// Only public frontend settings are embedded into browser JavaScript.
const { execFileSync } = require('node:child_process');
const { existsSync } = require('node:fs');

function input(name) {
  const value = process.env['INPUT_' + name.toUpperCase()];
  if (!value || !value.trim()) {
    throw new Error('Missing action input: ' + name);
  }
  return value.trim();
}

function azure(args, json = false) {
  const count = args[0] === 'containerapp' && args[1] === 'update' ? 2 : 3;
  const operation = args.slice(0, count).join(' ');
  console.log('Azure operation: ' + operation);
  try {
    const output = execFileSync('az', [
      ...args, '--only-show-errors', '--output', json ? 'json' : 'none'
    ], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 32 * 1024 * 1024
    });
    return json ? JSON.parse(output) : undefined;
  } catch (error) {
    console.error('Azure operation failed: ' + operation);
    if (error.stderr) console.error(String(error.stderr));
    throw error;
  }
}

function buildReact() {
  const label = (process.env.INPUT_CONFIG_LABEL || 'dev').trim();
  const configuration = azure([
    'appconfig', 'kv', 'list',
    '--endpoint', input('app_config_endpoint'),
    '--auth-mode', 'login',
    '--key', 'frontend-*',
    '--label', label,
    '--all'
  ], true);

  if (!Array.isArray(configuration) || configuration.length === 0) {
    throw new Error('Add frontend- ordinary settings with label ' + label + ' in App Configuration.');
  }

  const settings = {};
  for (const item of configuration) {
    if (typeof item.key !== 'string' ||
        !/^frontend-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(item.key)) {
      throw new Error('Frontend keys must use lowercase words separated by single hyphens.');
    }
    const type = String(item.content_type || item.contentType || '').toLowerCase();
    if (type.includes('keyvaultref') || type.includes('ff+')) {
      throw new Error('Frontend configuration must contain ordinary public settings, not Key Vault references or feature flags.');
    }
    if (typeof item.value !== 'string' || item.value.includes('\0') ||
        item.value.startsWith('secretref:')) {
      throw new Error('Frontend settings must contain ordinary public text.');
    }
    const name = 'REACT_APP_' + item.key.slice('frontend-'.length)
      .replaceAll('-', '_').toUpperCase();
    if (Object.hasOwn(settings, name)) {
      throw new Error('Duplicate frontend setting found.');
    }
    settings[name] = item.value;
  }

  if (!settings.REACT_APP_API_URL || !settings.REACT_APP_API_URL.trim()) {
    throw new Error('Add frontend-api-url with the actual backend API base URL.');
  }
  if (!settings.REACT_APP_RECAPTCHA_SITE_KEY || !settings.REACT_APP_RECAPTCHA_SITE_KEY.trim()) {
    throw new Error('Add frontend-recaptcha-site-key with the public site key used by the login pages.');
  }
  let api;
  try { api = new URL(settings.REACT_APP_API_URL); }
  catch { throw new Error('frontend-api-url must be an absolute HTTPS URL.'); }
  if (api.protocol !== 'https:' || api.username || api.password) {
    throw new Error('frontend-api-url must be an HTTPS URL without embedded credentials.');
  }
  if (!existsSync('package-lock.json')) {
    throw new Error('Commit package-lock.json at the frontend repository root.');
  }

  execFileSync('npm', ['ci'], { stdio: 'inherit' });
  execFileSync('npm', ['run', 'build'], {
    stdio: 'inherit',
    env: { ...process.env, ...settings, GENERATE_SOURCEMAP: 'false' }
  });
  if (!existsSync('build/index.html')) {
    throw new Error('Expected build/index.html after the React build.');
  }
  console.log('React build completed with ' + configuration.length + ' public settings.');
}

function deploy() {
  const app = input('app_name');
  const group = input('resource_group');
  const image = input('image');
  const identity = input('runtime_identity_resource_id');

  // Configure the app runtime identity separately from the runner ACR login.
  azure([
    'containerapp', 'registry', 'set',
    '--name', app, '--resource-group', group,
    '--server', image.split('/')[0], '--identity', identity
  ]);
  // Configure ingress and existing health probes for port 8080 once in Azure.
  azure([
    'containerapp', 'update',
    '--name', app, '--resource-group', group, '--image', image
  ]);
  console.log('Frontend image deployed.');
}

function main() {
  switch (input('operation')) {
    case 'build-react': buildReact(); return;
    case 'acr-login':
      azure(['acr', 'login', '--name', input('acr_name')]);
      console.log('ACR login completed.');
      return;
    case 'deploy': deploy(); return;
    default:
      throw new Error('Unsupported operation. Choose build-react, acr-login, or deploy.');
  }
}

try {
  main();
} catch (error) {
  const message = error && error.status !== undefined
    ? 'A frontend build or Azure command failed (exit ' + error.status + '). Check the error above.'
    : error instanceof SyntaxError || error instanceof TypeError
      ? 'The configuration response had an unexpected format.'
      : error.message || 'Frontend task failed.';
  console.error('::error::' + String(message)
    .replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A'));
  process.exitCode = 1;
}
