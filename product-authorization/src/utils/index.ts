import { APIGatewayIAMAuthorizerResult, PolicyDocument } from 'aws-lambda';
import cookie from 'cookie';

export function parseAPIGatewayCookies(headers: string): Record<string, string> {
  return cookie.parse(headers);
}

export function generatePolicy(
  principalId: string,
  effect?: string,
  resource?: string | string[]
): APIGatewayIAMAuthorizerResult {
  const authResponse: APIGatewayIAMAuthorizerResult = {
    principalId,
    policyDocument: null,
  };

  if (effect && resource) {
    const policyDocument: PolicyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    };

    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
}

export function generateAllow(
  principalId: string,
  resource?: string | string[]
): APIGatewayIAMAuthorizerResult {
  return generatePolicy(principalId, 'Allow', resource);
}

export function generateDeny(
  principalId: string,
  resource?: string | string[]
): APIGatewayIAMAuthorizerResult {
  return generatePolicy(principalId, 'Deny', resource);
}
