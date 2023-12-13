import { Type } from '@openmrs/esm-framework';
import { defaulterTracingEncounterUuid } from './hooks/usePatientTracing';

export const configSchema = {
  defaulterTracingEncounterUuid: {
    _type: Type.String,
    _description: 'Encounter UUID for defaulter tracing',
    _default: '1495edf8-2df2-11e9-b210-d663bd873d93',
  },
};
export interface ConfigObject {
  defaulterTracingEncounterUuid: string;
}
