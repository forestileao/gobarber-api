import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import { validate } from 'uuid';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  providerId: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ date, providerId }: Request): Promise<Appointment> {
    const appointmentRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }
    if (!validate(providerId)) {
      throw new AppError('Provider id format not supported');
    }

    const appointment = appointmentRepository.create({
      providerId,
      date: appointmentDate,
    });

    await appointmentRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
