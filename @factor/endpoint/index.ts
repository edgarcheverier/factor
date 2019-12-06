import { emitEvent } from "@factor/tools/events"
import { isNode } from "@factor/tools/utils"
import { localhostUrl } from "@factor/tools/url"
import { userToken, handleTokenError } from "@factor/user/token"
import axios, { AxiosResponse, AxiosRequestConfig } from "axios"

export interface EndpointRequestConfig {
  id: string;
  method: string;
  params: object;
  headers?: object;
}

export const endpointPath = (_id: string): string => {
  return `/_api_/${_id}`
}

export const bearerToken = (): string => {
  return `Bearer ${userToken()}`
}

export const authorizedRequest = async (
  path: string,
  data: object,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  const { headers = {} } = options

  options.headers = { Authorization: bearerToken(), ...headers }

  if (isNode) {
    options.baseURL = localhostUrl() //currentUrl()
  }

  return await axios.post(path, data, options)
}

export const endpointRequest = async ({
  id,
  method,
  params = {},
  headers = {}
}: EndpointRequestConfig): Promise<any> => {
  try {
    if (!method) {
      throw new Error(`Endpoint request to "${id}" requires a method.`)
    }

    const {
      data: { result, error }
    } = await authorizedRequest(endpointPath(id), { method, params }, { headers })

    if (error) {
      handleTokenError(error, {
        onError: (): void => {
          emitEvent("error", error)
          // eslint-disable-next-line no-console
          console.error(error)
        }
      })
    }

    return result
  } catch (error) {
    throw new Error(error)
  }
}