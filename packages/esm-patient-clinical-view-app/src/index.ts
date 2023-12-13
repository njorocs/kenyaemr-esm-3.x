import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';

import { configSchema } from './config-schema';
import { createDashboardLink, registerWorkspace } from '@openmrs/esm-patient-common-lib';
import DefaulterTracing from './defaulter-tracing/defaulter-tracing.component';

const moduleName = '@kenyaemr/esm-patient-clinical-view-app';

const options = {
  featureName: 'patient-clinical-view-app',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');
export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
export const defaulterTracing = getSyncLifecycle(DefaulterTracing, options);
