import { DbAddAccount } from './db-add-account';

describe('DbAddAccount Use Case', () => {
  test('Deve chamar o encriptador com uma senha correta', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => resolve('hashed_password'));
      }
    }

    const encrypterStub = new EncrypterStub();
    const sut = new DbAddAccount(encrypterStub);
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_name', email: 'valid_email', password: 'valid_password'
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });
});