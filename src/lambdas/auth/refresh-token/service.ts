import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { RefreshTokenPayload } from '.'
import { InvalidCredentialsError } from '@/helpers/errors/invalid-credentials-error'

export class RefreshTokenService {
  constructor(private readonly cognitoClient: CognitoIdentityProviderClient) {}

  async execute(payload: RefreshTokenPayload) {
    const cmd = new InitiateAuthCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: payload.refreshToken,
      },
    })

    const { AuthenticationResult } = await this.cognitoClient.send(cmd)

    if (!AuthenticationResult) {
      throw new InvalidCredentialsError()
    }

    const { AccessToken, RefreshToken } = AuthenticationResult

    return {
      accessToken: AccessToken,
      refreshToken: RefreshToken,
    }
  }
}
