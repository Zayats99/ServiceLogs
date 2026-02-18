import dayjs from 'dayjs';
import type { ServiceLogFormValues } from '../types/serviceLog';

export const getToday = (): string => dayjs().format('YYYY-MM-DD');

export const getNextDay = (startDate: string): string =>
  dayjs(startDate).add(1, 'day').format('YYYY-MM-DD');

export const getDefaultFormValues = (): ServiceLogFormValues => {
  const startDate = getToday();

  return {
    providerId: '',
    serviceOrder: '',
    carId: '',
    odometer: 0,
    engineHours: 0,
    startDate,
    endDate: getNextDay(startDate),
    type: 'planned',
    serviceDescription: ''
  };
};
