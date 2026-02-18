import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useMemo, useRef } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useAppDispatch } from '../../../app/hooks';
import { markDraftSavedState, upsertActiveDraftData } from '../../draftsSlice';
import type { Draft, ServiceLogFormValues } from '../../../types/serviceLog';
import { getDefaultFormValues, getNextDay } from '../../../utils/date';
import { serviceLogSchema, serviceTypeOptions } from '../serviceLogValidation';

type Props = {
  activeDraft?: Draft;
  onCreateServiceLog: (data: ServiceLogFormValues) => void;
};

export function ServiceLogFormCard({ activeDraft, onCreateServiceLog }: Props) {
  const dispatch = useAppDispatch();
  const autosaveTimer = useRef<number | null>(null);
  const skipNextAutosaveRef = useRef(false);
  const activeDraftRef = useRef<Draft | undefined>(activeDraft);

  useEffect(() => {
    activeDraftRef.current = activeDraft;
  }, [activeDraft]);

  const defaultValues = useMemo(
    () => activeDraft?.data ?? getDefaultFormValues(),
    [activeDraft]
  );

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ServiceLogFormValues>({
    resolver: yupResolver(serviceLogSchema),
    defaultValues
  });

  useEffect(() => {
    if (!activeDraft) return;
    skipNextAutosaveRef.current = true;
    reset(activeDraft.data);
  }, [activeDraft?.id, reset]);

  const startDate = watch('startDate');
  useEffect(() => {
    if (!startDate) return;
    setValue('endDate', getNextDay(startDate), { shouldValidate: true });
  }, [startDate, setValue]);

  useEffect(() => {
    const subscription = watch((value) => {
      const draft = activeDraftRef.current;
      if (!draft) return;

      if (skipNextAutosaveRef.current) {
        skipNextAutosaveRef.current = false;
        return;
      }

      const payload = {
        ...getDefaultFormValues(),
        ...value
      } as ServiceLogFormValues;

      if (draft.saved) {
        dispatch(markDraftSavedState({ id: draft.id, saved: false }));
      }

      if (autosaveTimer.current) {
        window.clearTimeout(autosaveTimer.current);
      }

      autosaveTimer.current = window.setTimeout(() => {
        dispatch(upsertActiveDraftData(payload));
      }, 350);
    });

    return () => {
      subscription.unsubscribe();
      if (autosaveTimer.current) {
        window.clearTimeout(autosaveTimer.current);
      }
    };
  }, [watch, dispatch]);

  const draftStatusMessage = !activeDraft
    ? 'No active draft'
    : activeDraft.saved
      ? 'Draft saved'
      : 'Saving...';

  const onSubmit: SubmitHandler<ServiceLogFormValues> = (data) => {
    onCreateServiceLog(data);
    const draft = activeDraftRef.current;
    if (!draft) return;

    const defaults = getDefaultFormValues();
    skipNextAutosaveRef.current = true;
    dispatch(upsertActiveDraftData(defaults));
    reset(defaults);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Service Log Creation Form</Typography>
        <Alert severity={draftStatusMessage === 'Saving...' ? 'info' : 'success'} sx={{ py: 0 }}>
          {draftStatusMessage}
        </Alert>
      </Stack>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Provider ID"
              fullWidth
              {...register('providerId')}
              error={!!errors.providerId}
              helperText={errors.providerId?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Service Order"
              fullWidth
              {...register('serviceOrder')}
              error={!!errors.serviceOrder}
              helperText={errors.serviceOrder?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Car ID"
              fullWidth
              {...register('carId')}
              error={!!errors.carId}
              helperText={errors.carId?.message}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Odometer (mi)"
              type="number"
              fullWidth
              {...register('odometer', { valueAsNumber: true })}
              error={!!errors.odometer}
              helperText={errors.odometer?.message}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Engine Hours"
              type="number"
              fullWidth
              {...register('engineHours', { valueAsNumber: true })}
              error={!!errors.engineHours}
              helperText={errors.engineHours?.message}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register('startDate')}
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              disabled
              InputLabelProps={{ shrink: true }}
              {...register('endDate')}
              error={!!errors.endDate}
              helperText={errors.endDate?.message}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Service Type"
                  fullWidth
                  {...field}
                  error={!!errors.type}
                  helperText={errors.type?.message}
                >
                  {serviceTypeOptions.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Service Description"
              fullWidth
              multiline
              minRows={3}
              {...register('serviceDescription')}
              error={!!errors.serviceDescription}
              helperText={errors.serviceDescription?.message}
            />
          </Grid>
        </Grid>

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Create Service Log
        </Button>
      </Box>
    </Paper>
  );
}

