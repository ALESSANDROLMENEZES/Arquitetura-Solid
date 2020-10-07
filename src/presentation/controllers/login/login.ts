import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';
import { IHttpRequest, IHttpResponse } from '../../protocols';
import { IController } from '../../protocols/controller';
import { IEmailValidator } from '../signup/signup-protocols';

export class LoginController implements IController {
  private readonly emailValidator: IEmailValidator;
  constructor (emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.body.email) {
      return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))));
    }
    if (!httpRequest.body.password) {
      return await new Promise(resolve => resolve(badRequest(new MissingParamError('password'))));
    }
    this.emailValidator.isValid(httpRequest.body.email);
    return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))));
  }
}