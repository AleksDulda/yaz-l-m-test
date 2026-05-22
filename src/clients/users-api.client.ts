import { APIRequestContext, APIResponse } from '@playwright/test';
import { CreateUserRequest } from '../models/user.types';

export interface TimedResponse {
  response: APIResponse;
  elapsedMs: number;
}

export class UsersApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async createUser(payload: CreateUserRequest): Promise<TimedResponse> {
    const startedAt = Date.now();
    const response = await this.request.post('/api/users', { data: payload });
    return { response, elapsedMs: Date.now() - startedAt };
  }

  async getUserById(id: number): Promise<TimedResponse> {
    const startedAt = Date.now();
    const response = await this.request.get(`/api/users/${id}`);
    return { response, elapsedMs: Date.now() - startedAt };
  }
}
