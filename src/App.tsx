import { Container, Grid, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import {
  clearAllDrafts,
  createNewDraft,
  deleteActiveDraft,
  setActiveDraft,
} from './features/draftsSlice';
import {
  createServiceLog,
  deleteServiceLog,
  updateServiceLog
} from './features/serviceLogsSlice';
import { useAppDispatch, useAppSelector } from './app/hooks';
import type { ServiceLog } from './types/serviceLog';
import { DraftsPanel } from './features/drafts/components/DraftsPanel';
import { EditServiceLogDialog } from './features/serviceLogs/components/EditServiceLogDialog';
import { ServiceLogFormCard } from './features/serviceLogs/components/ServiceLogFormCard';
import { ServiceLogsTable } from './features/serviceLogs/components/ServiceLogsTable';

function App() {
  const dispatch = useAppDispatch();
  const draftsState = useAppSelector((state) => state.drafts);
  const logs = useAppSelector((state) => state.serviceLogs.logs);

  const [editingLog, setEditingLog] = useState<ServiceLog | null>(null);

  const activeDraft = useMemo(
    () => draftsState.drafts.find((draft) => draft.id === draftsState.activeDraftId),
    [draftsState.drafts, draftsState.activeDraftId]
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        MediDrive Service Logs
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Draft autosave with Redux Persist, validation with React Hook Form + Yup,
        and searchable service log history.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <DraftsPanel
            drafts={draftsState.drafts}
            activeDraftId={draftsState.activeDraftId}
            onCreateDraft={() => dispatch(createNewDraft())}
            onSelectDraft={(id) => dispatch(setActiveDraft(id))}
            onDeleteActiveDraft={() => dispatch(deleteActiveDraft())}
            onClearAllDrafts={() => dispatch(clearAllDrafts())}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <ServiceLogFormCard
            activeDraft={activeDraft}
            onCreateServiceLog={(data) => dispatch(createServiceLog(data))}
          />
        </Grid>
      </Grid>

      <ServiceLogsTable
        logs={logs}
        onEdit={(log) => setEditingLog(log)}
        onDelete={(id) => dispatch(deleteServiceLog(id))}
      />

      <EditServiceLogDialog
        log={editingLog}
        open={!!editingLog}
        onClose={() => setEditingLog(null)}
        onSave={(id, changes) => dispatch(updateServiceLog({ id, changes }))}
      />
    </Container>
  );
}

export default App;
