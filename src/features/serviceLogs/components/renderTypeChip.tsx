import { Chip } from '@mui/material';
import type { ServiceType } from '../../../types/serviceLog';

export function renderTypeChip(type: ServiceType) {
  const color = type === 'planned' ? 'success' : type === 'unplanned' ? 'warning' : 'error';
  return <Chip size="small" color={color} label={type} />;
}

