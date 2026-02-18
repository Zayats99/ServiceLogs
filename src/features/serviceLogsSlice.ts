import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { ServiceLog, ServiceLogFormValues } from '../types/serviceLog';

interface ServiceLogsState {
  logs: ServiceLog[];
}

const initialState: ServiceLogsState = {
  logs: []
};

export const serviceLogsSlice = createSlice({
  name: 'serviceLogs',
  initialState,
  reducers: {
    createServiceLog(state, action: PayloadAction<ServiceLogFormValues>) {
      const now = new Date().toISOString();
      state.logs.unshift({
        id: uuidv4(),
        ...action.payload,
        createdAt: now,
        updatedAt: now
      });
    },
    updateServiceLog(
      state,
      action: PayloadAction<{ id: string; changes: ServiceLogFormValues }>
    ) {
      const log = state.logs.find((item) => item.id === action.payload.id);
      if (!log) return;

      Object.assign(log, action.payload.changes, {
        updatedAt: new Date().toISOString()
      });
    },
    deleteServiceLog(state, action: PayloadAction<string>) {
      state.logs = state.logs.filter((item) => item.id !== action.payload);
    }
  }
});

export const { createServiceLog, updateServiceLog, deleteServiceLog } =
  serviceLogsSlice.actions;

export default serviceLogsSlice.reducer;
