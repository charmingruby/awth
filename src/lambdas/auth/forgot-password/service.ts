import {
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { ForgotPasswordPayload } from '.'

export class ForgotPasswordService {
  constructor(private readonly cognitoClient: CognitoIdentityProviderClient) {}

  async execute(payload: ForgotPasswordPayload) {
    const cmd = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: payload.email,
    })

    await this.cognitoClient.send(cmd)
  }
}
