import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      providerId: '53444717-03bd-44cb-97fa-499dfe8705b1',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.providerId).toBe('53444717-03bd-44cb-97fa-499dfe8705b1');
  });

  // it('should not be able two appointments in the same time', () => {
  //   expect();
  // });
});
