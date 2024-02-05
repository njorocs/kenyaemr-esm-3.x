import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate, useConfig } from '@openmrs/esm-framework';
import { SURGICAL_HISTORY_UUID, ACCIDENT_TRAUMA_UUID, BLOOD_TRANSFUSION_UUID } from '../../../utils/constants';
import { getObsFromEncounter } from '../../../ui/encounter-list/encounter-list-utils';
import { EmptyState, launchPatientWorkspace, ErrorState, CardHeader } from '@openmrs/esm-patient-common-lib';
import {
  OverflowMenu,
  OverflowMenuItem,
  InlineLoading,
  Button,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from '@carbon/react';
import { useClinicalEncounter } from '../../../hooks/useClinicalEncounter';
import { ConfigObject } from '../../../config-schema';

import { Add } from '@carbon/react/icons';
interface OutPatientMedicalHistoryProps {
  patientUuid: string;
}

const OutPatientMedicalHistory: React.FC<OutPatientMedicalHistoryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const {
    clinicalEncounterUuid,
    formsList: { clinicalEncounterFormUuid },
  } = useConfig<ConfigObject>();
  const headerTitle = t('medicalHistory', 'Medical History');
  const { encounters, isLoading, error, mutate, isValidating } = useClinicalEncounter(
    patientUuid,
    clinicalEncounterUuid,
  );
  const handleOpenOrEditClinicalEncounterForm = (encounterUUID = '') => {
    launchPatientWorkspace('patient-form-entry-workspace', {
      workspaceTitle: 'Medical History',
      mutateForm: mutate,
      formInfo: {
        encounterUuid: encounterUUID,
        formUuid: clinicalEncounterFormUuid,
        patientUuid,
        visitTypeUuid: '',
        visitUuid: '',
      },
    });
  };
  const tableHeader = [
    {
      key: 'encounterDate',
      header: t('encounterDate', 'Date'),
    },
    {
      key: 'surgicalHistory',
      header: t('surgicalHistory', 'Surgical History'),
    },
    {
      key: 'bloodTransfusion',
      header: t('bloodTransfusion', 'Blood Transfusion'),
    },
    {
      key: 'accidentOrTrauma',
      header: t('accidentOrTrauma', 'Accident or Trauma'),
    },
    {
      key: 'finalDiagnosis',
      header: t('finalDiagnosis', 'Final Diagnosis'),
    },
  ];
  const tableRows = encounters?.map((encounter, index) => {
    return {
      id: `${encounter.uuid}`,
      encounterDate: formatDate(new Date(encounter.encounterDatetime)),
      surgicalHistory: getObsFromEncounter(encounter, SURGICAL_HISTORY_UUID),
      bloodTransfusion: getObsFromEncounter(encounter, BLOOD_TRANSFUSION_UUID),
      accidentOrTrauma: getObsFromEncounter(encounter, ACCIDENT_TRAUMA_UUID),
      finalDiagnosis: encounter.diagnoses.length > 0 ? encounter.diagnoses[0].diagnosis.coded.display : '--',
      actions: (
        <OverflowMenu aria-label="overflow-menu" flipped="false">
          <OverflowMenuItem
            onClick={() => handleOpenOrEditClinicalEncounterForm(encounter.uuid)}
            itemText={t('edit', 'Edit')}
          />
          <OverflowMenuItem itemText={t('delete', 'Delete')} isDelete />
        </OverflowMenu>
      ),
    };
  });
  if (isLoading) {
    return <InlineLoading status="active" iconDescription="Loading" description="Loading data..." />;
  }
  if (error) {
    return <ErrorState error={error} headerTitle={t('medicalHistory', 'Medical History')} />;
  }
  if (encounters.length === 0) {
    return (
      <EmptyState
        displayText={t('clinicalEncounter', 'Clinical Encounter')}
        headerTitle={t('medicalHistory', 'Medical History')}
        launchForm={handleOpenOrEditClinicalEncounterForm}
      />
    );
  }
  return (
    <>
      <CardHeader title={headerTitle}>
        <Button
          size="md"
          kind="ghost"
          onClick={() => handleOpenOrEditClinicalEncounterForm()}
          renderIcon={(props) => <Add size={24} {...props} />}
          iconDescription="Add">
          {t('add', 'Add')}
        </Button>
      </CardHeader>
      <DataTable
        size="sm"
        rows={tableRows}
        headers={tableHeader}
        render={({ rows, headers, getHeaderProps, getRowProps, getTableProps, getTableContainerProps }) => (
          <TableContainer size="sm" {...getTableContainerProps()}>
            <Table size="sm" {...getTableProps()} aria-label="sample table">
              <TableHead>
                <TableRow>
                  {headers.map((header, i) => (
                    <TableHeader
                      key={i}
                      {...getHeaderProps({
                        header,
                      })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    {...getRowProps({
                      row,
                    })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      />
    </>
  );
};
export default OutPatientMedicalHistory;
