import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { Draft, ServiceLogFormValues } from '../types/serviceLog';
import { getDefaultFormValues } from '../utils/date';

interface DraftsState {
  activeDraftId: string | null;
  drafts: Draft[];
}

const createDraft = (data?: ServiceLogFormValues): Draft => ({
  id: uuidv4(),
  name: `Draft ${new Date().toLocaleTimeString()}`,
  data: data ?? getDefaultFormValues(),
  saved: true,
  updatedAt: new Date().toISOString()
});

const initialDraft = createDraft();

const initialState: DraftsState = {
  activeDraftId: initialDraft.id,
  drafts: [initialDraft]
};

export const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    createNewDraft(state) {
      const draft = createDraft();
      state.drafts.unshift(draft);
      state.activeDraftId = draft.id;
    },
    setActiveDraft(state, action: PayloadAction<string>) {
      state.activeDraftId = action.payload;
    },
    upsertActiveDraftData(state, action: PayloadAction<ServiceLogFormValues>) {
      const activeId = state.activeDraftId;
      if (!activeId) return;

      const draft = state.drafts.find((item) => item.id === activeId);
      if (!draft) return;

      draft.data = action.payload;
      draft.saved = true;
      draft.updatedAt = new Date().toISOString();
    },
    deleteActiveDraft(state) {
      const activeId = state.activeDraftId;
      if (!activeId) return;

      state.drafts = state.drafts.filter((item) => item.id !== activeId);
      state.activeDraftId = state.drafts[0]?.id ?? null;

      if (state.drafts.length === 0) {
        const fallbackDraft = createDraft();
        state.drafts = [fallbackDraft];
        state.activeDraftId = fallbackDraft.id;
      }
    },
    clearAllDrafts(state) {
      const fallbackDraft = createDraft();
      state.drafts = [fallbackDraft];
      state.activeDraftId = fallbackDraft.id;
    },
    markDraftSavedState(
      state,
      action: PayloadAction<{ id: string; saved: boolean }>
    ) {
      const draft = state.drafts.find((item) => item.id === action.payload.id);
      if (!draft) return;
      draft.saved = action.payload.saved;
    }
  }
});

export const {
  createNewDraft,
  setActiveDraft,
  upsertActiveDraftData,
  deleteActiveDraft,
  clearAllDrafts,
  markDraftSavedState
} = draftsSlice.actions;

export default draftsSlice.reducer;
