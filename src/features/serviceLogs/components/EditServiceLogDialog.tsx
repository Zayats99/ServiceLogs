import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField
} from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { ServiceLog, ServiceLogFormValues } from '../../../types/serviceLog';
import { getDefaultFormValues, getNextDay } from '../../../utils/date';
import { serviceLogSchema, serviceTypeOptions } from '../serviceLogValidation';

type Props = {
  log: ServiceLog | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, changes: ServiceLogFormValues) => void;
};

export function EditServiceLogDialog({ log, open, onClose, onSave }: Props) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ServiceLogFormValues>({
    resolver: yupResolver(serviceLogSchema),
    defaultValues: getDefaultFormValues()
  });

  useEffect(() => {
    if (!log) return;
    reset(log);
  }, [log, reset]);

  const startDate = watch('startDate');
  useEffect(() => {
    if (!log || !startDate) return;
    setValue('endDate', getNextDay(startDate), { shouldValidate: true });
  }, [log, startDate, setValue]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Service Log</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ pt: 1 }}>
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
                label="Odometer"
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
                  <TextField select label="Service Type" fullWidth {...field} error={!!errors.type}>
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit((data) => {
            if (!log) return;
            onSave(log.id, data);
            onClose();
          })}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

