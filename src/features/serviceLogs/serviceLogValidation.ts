import * as yup from 'yup';
import { getNextDay } from '../../utils/date';
import type { ServiceType } from '../../types/serviceLog';

export const serviceTypeOptions: ServiceType[] = ['planned', 'unplanned', 'emergency'];

export const serviceLogSchema = yup
  .object({
    providerId: yup.string().required('Provider ID is required'),
    serviceOrder: yup.string().required('Service order is required'),
    carId: yup.string().required('Car ID is required'),
    odometer: yup
      .number()
      .typeError('Odometer must be a number')
      .min(0, 'Must be greater than or equal to 0')
      .required('Odometer is required'),
    engineHours: yup
      .number()
      .typeError('Engine hours must be a number')
      .min(0, 'Must be greater than or equal to 0')
      .required('Engine hours are required'),
    startDate: yup.string().required('Start date is required'),
    endDate: yup
      .string()
      .required('End date is required')
      .test('is-next-day', 'End date must be the next day', function (endDate) {
        const startDate = this.parent?.startDate as string | undefined;
        if (!startDate || !endDate) return true;
        return endDate === getNextDay(startDate);
      }),
    type: yup.mixed<ServiceType>().oneOf(serviceTypeOptions).required('Service type is required'),
    serviceDescription: yup.string().required('Service description is required')
  })
  .required();

