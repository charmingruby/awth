import {
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { ResetPasswordPayload } from '.'

export class ResetPasswordService {
  constructor(private readonly cognitoClient: CognitoIdentityProviderClient) {}

  async execute(payload: ResetPasswordPayload) {
    const resetPasswordCmd = new ConfirmForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      ConfirmationCode: payload.code,
      Username: payload.email,
      Password: payload.newPassword,
    })

    await this.cognitoClient.send(resetPasswordCmd)

    const authCmd = new InitiateAuthCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: payload.email,
        PASSWORD: payload.newPassword,
      },
    })

    const { AuthenticationResult } = await this.cognitoClient.send(authCmd)

    return {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    }
  }
}
