import { faker } from '@faker-js/faker';
import { User, UserRole } from '@prisma/client';

export const mockPrismaUser: User = {
  id: faker.string.uuid(),
  alma_id: faker.string.uuid(),
  name: faker.person.fullName(),
  social_name: faker.person.fullName(),
  role: UserRole.CLIENT,
  created_at: faker.date.recent(),
  updated_at: faker.date.recent(),
};

export const mockSignInAxiosResponse = {
  data: {
    accessToken: 'jwtAccessToken',
  },
};
