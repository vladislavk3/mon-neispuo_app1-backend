import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import jwks from 'jwks-rsa'
import jwt from 'jsonwebtoken';

@Injectable()
export class JwksGuard implements CanActivate {
  jwksClient = jwks({
    jwksUri: 'https://dss-oidc-server.zenoncultural.com/jwks',
    timeout: 60000, // Defaults to 30s
  });

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeaders = request?.headers?.authorization || request?.headers?.Authorization || ''
    const jwt = authHeaders.split(' ')[1] // 'Bearer jwtTokenString'.split(' ')[1]

    const decoded = await this.verifyToken(jwt)
    return !!decoded;
  }

  // from example: https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
  private getKey(header, callback) {
    this.jwksClient.getSigningKey(header.kid, function (err, key) {
      if (err) {
        return callback(err, undefined)
      }

      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  }

  private async verifyToken(token, options = {}) {
    return new Promise((resolve, reject) => {

      jwt.verify(token, this.getKey.bind(this), options, function (err, decoded) {
        if (err) {
          return resolve(null)
        }
        resolve(decoded)
      })
    })
  }
}
