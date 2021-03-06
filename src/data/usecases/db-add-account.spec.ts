import { Encrypter, IAccountModel, IAddAccountModel, IAddAccountRepository } from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'));
    }
  }
  return new EncrypterStub();
};

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add (accountData: IAddAccountModel): Promise<IAccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      };
      return await new Promise(resolve => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: IAddAccountRepository
}

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = makeAddAccountRepository();
  const encrypterStub = makeEncrypter();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    encrypterStub,
    sut,
    addAccountRepositoryStub
  };
};

describe('DbAddAccount Use Case', () => {
  test('Deve chamar o encriptador com uma senha correta', async () => {
    const { encrypterStub, sut } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_name', email: 'valid_email', password: 'valid_password'
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Se ocorrer algum erro a mensagem deve ser repassada para a função que o chamou', async () => {
    const { encrypterStub, sut } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const accountData = {
      name: 'valid_name', email: 'valid_email', password: 'valid_password'
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test('Deve chamar o AddAccountRepository com um valor correto', async () => {
    const { addAccountRepositoryStub, sut } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const accountData = {
      name: 'valid_name', email: 'valid_email', password: 'valid_password'
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name', email: 'valid_email', password: 'hashed_password'
    });
  });

  test('Se ocorrer algum erro a mensagem deve ser repassada para a função que o chamou', async () => {
    const { addAccountRepositoryStub, sut } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const accountData = {
      name: 'valid_name', email: 'valid_email', password: 'valid_password'
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test('Deve retornar uma conta ao ter sucesso', async () => {
    const { sut } = makeSut();

    const accountData = {
      name: 'valid_name', email: 'valid_email', password: 'valid_password'
    };

    const account = await sut.add(accountData);
    await sut.add(accountData);
    expect(account).toEqual({
      id: 'valid_id', name: 'valid_name', email: 'valid_email', password: 'hashed_password'
    });
  });
});
