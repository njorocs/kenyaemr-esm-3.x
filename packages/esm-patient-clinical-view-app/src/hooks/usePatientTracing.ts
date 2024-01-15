import useSWR from 'swr';
import { OpenmrsEncounter } from '../types';
import { openmrsFetch, useConfig } from '@openmrs/esm-framework';
import { ConfigObject } from '../config-schema';
import { encounterRepresentation, MissedAppointmentDate_UUID } from '../../../utils/constants';
import groupBy from 'lodash-es/groupBy';

export const defaulterTracingEncounterUuid = '1495edf8-2df2-11e9-b210-d663bd873d93';

export function usePatientTracing(patientUuid: string, encounterType: string) {
  const config = useConfig() as ConfigObject;
  const url = `/ws/rest/v1/encounter?encounterType=${config.defaulterTracingEncounterUuid}&patient=${patientUuid}&v=${encounterRepresentation}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: { results: OpenmrsEncounter[] } }, Error>(
    url,
    openmrsFetch,
  );
  const responseData = data?.data ? data?.data?.results : [];
  const results = responseData.flatMap((el) => el.obs).filter((obs) => obs.concept.uuid === MissedAppointmentDate_UUID);

  const groupedData = results.reduce((acc, encounter) => {
    const sessionDate = encounter.value;
    if (!acc[sessionDate]) {
      // If the key doesn't exist in the accumulator, create it with an empty array. We could also use encounter date?
      acc[sessionDate] = [];
    }
    //Push the encounter to the corresponding sessionDate key
    acc[sessionDate].push(encounter);
    return acc;
  }, {});
  const uniqueSessionDates = results.map((el) => el.value);
  uniqueSessionDates.map(() => {
    const data = responseData.find((encounter) =>
      encounter.obs.find((ob) => ob.concept.uuid === MissedAppointmentDate_UUID),
    );
  });
  // console.log("Grouped enc : ",groupedData);
  return {
    encounters: data?.data ? data?.data?.results : [],
    groupedEncounters: groupedData,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
