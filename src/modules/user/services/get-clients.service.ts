import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { IUserRepository } from '../interfaces/repository.interface';
import { ProfessionalClients } from '../interfaces/user.interface';

@Injectable()
export class GetClientsService {
  constructor(
    @Inject(UserRepository)
    private userRepository: IUserRepository,
  ) {}

  execute(professionalId: string): Promise<ProfessionalClients> {
    return this.userRepository.getClients(professionalId);
  }
}
