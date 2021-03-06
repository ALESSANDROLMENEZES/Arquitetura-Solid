import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hashSync (): Promise <string> {
    return await new Promise(resolve => resolve('hash'));
  }
}));

const salt = 10;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt adapter', () => {
  test('Deve chamar o bcrypt com um valor correto', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hashSync');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Deve chamar o bcrypt com um valor correto', async () => {
    const sut = makeSut();
    const result = await sut.encrypt('any_value');
    expect(result).toBe('hash');
  });
});
