export interface DemoUser {
  email: string;
  password: string;
}

export const validUser: DemoUser = {
  email: 'qa.tester@example.com',
  password: 'P@ssw0rd!',
};

export const invalidEmailUser: DemoUser = {
  email: 'not-an-email',
  password: 'P@ssw0rd!',
};

export const shortPasswordUser: DemoUser = {
  email: 'qa.tester@example.com',
  password: '123',
};
