import { buildApp } from '../../app.js';

export function getTestApp() {
  return buildApp().callback();
}
