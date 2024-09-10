import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { AccountConfirmationPayload } from '.'

export class AccountConfirmationService {
  constructor(private readonly cognitoClient: CognitoIdentityProviderClient) {}

  async execute({ code, email }: AccountConfirmationPayload) {
    const cmd = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    })

    await this.cognitoClient.send(cmd)
  }
}
