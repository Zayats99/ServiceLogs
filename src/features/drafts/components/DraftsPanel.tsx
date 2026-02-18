import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button, List, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import type { Draft } from '../../../types/serviceLog';

type Props = {
  drafts: Draft[];
  activeDraftId: string | null;
  onCreateDraft: () => void;
  onSelectDraft: (id: string) => void;
  onDeleteActiveDraft: () => void;
  onClearAllDrafts: () => void;
};

export function DraftsPanel({
  drafts,
  activeDraftId,
  onCreateDraft,
  onSelectDraft,
  onDeleteActiveDraft,
  onClearAllDrafts
}: Props) {
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h6">Drafts</Typography>
        <Button size="small" variant="contained" onClick={onCreateDraft}>
          Create Draft
        </Button>
      </Stack>

      <List dense sx={{ maxHeight: 260, overflow: 'auto', mb: 1 }}>
        {drafts.map((draft) => (
          <ListItemButton
            key={draft.id}
            selected={draft.id === activeDraftId}
            onClick={() => onSelectDraft(draft.id)}
          >
            <ListItemText
              primary={draft.name}
              secondary={dayjs(draft.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
            />
            {draft.saved && <CheckCircleIcon color="success" fontSize="small" />}
          </ListItemButton>
        ))}
      </List>

      <Stack direction="row" spacing={1}>
        <Button variant="outlined" color="error" fullWidth onClick={onDeleteActiveDraft}>
          Delete Draft
        </Button>
        <Button variant="outlined" fullWidth onClick={onClearAllDrafts}>
          Clear All Drafts
        </Button>
      </Stack>
    </Paper>
  );
}

