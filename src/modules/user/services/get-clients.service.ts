import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { IUserRepository } from '../interfaces/repository.interface';
import { ClientsByFilter } from '../interfaces/user.interface';
import { ClientFilter } from '../enum/client-filter.enum';

@Injectable()
export class GetClientsService {
  constructor(
    @Inject(UserRepository)
    private userRepository: IUserRepository,
  ) {}

  execute(
    professionalId: string,
    filter: ClientFilter,
  ): Promise<ClientsByFilter> {
    return this.userRepository.getClientsByFilter(professionalId, filter);
  }
}
