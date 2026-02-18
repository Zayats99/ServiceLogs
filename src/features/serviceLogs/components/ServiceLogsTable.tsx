import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import type { ServiceLog, ServiceType } from '../../../types/serviceLog';
import { serviceTypeOptions } from '../serviceLogValidation';
import { renderTypeChip } from './renderTypeChip';

type Props = {
  logs: ServiceLog[];
  onEdit: (log: ServiceLog) => void;
  onDelete: (id: string) => void;
};

export function ServiceLogsTable({ logs, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | ServiceType>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filteredLogs = useMemo(() => {
    const searchLower = search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        searchLower.length === 0 ||
        [log.providerId, log.serviceOrder, log.carId, log.serviceDescription]
          .join(' ')
          .toLowerCase()
          .includes(searchLower);

      const matchesType = typeFilter === 'all' || log.type === typeFilter;

      const matchesFrom =
        !fromDate || dayjs(log.startDate).isAfter(dayjs(fromDate).subtract(1, 'day'));

      const matchesTo = !toDate || dayjs(log.startDate).isBefore(dayjs(toDate).add(1, 'day'));

      return matchesSearch && matchesType && matchesFrom && matchesTo;
    });
  }, [logs, search, typeFilter, fromDate, toDate]);

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Service Logs
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Search"
            fullWidth
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="providerId, serviceOrder, carId..."
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="filter-type-label">Type</InputLabel>
            <Select
              labelId="filter-type-label"
              label="Type"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as 'all' | ServiceType)}
            >
              <MenuItem value="all">All</MenuItem>
              {serviceTypeOptions.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2.5}>
          <TextField
            label="Start Date From"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={2.5}>
          <TextField
            label="Start Date To"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
          />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 2 }} />

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Provider</TableCell>
            <TableCell>Order</TableCell>
            <TableCell>Car</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredLogs.map((log) => (
            <TableRow key={log.id} hover>
              <TableCell>{log.providerId}</TableCell>
              <TableCell>{log.serviceOrder}</TableCell>
              <TableCell>{log.carId}</TableCell>
              <TableCell>{log.startDate}</TableCell>
              <TableCell>{log.endDate}</TableCell>
              <TableCell>{renderTypeChip(log.type)}</TableCell>
              <TableCell sx={{ maxWidth: 320 }}>{log.serviceDescription}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onEdit(log)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => onDelete(log.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {filteredLogs.length === 0 && (
            <TableRow>
              <TableCell colSpan={8}>
                <Typography color="text.secondary">No logs found.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}

