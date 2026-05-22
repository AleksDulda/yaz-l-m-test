import { test, expect } from '@playwright/test';
import { UsersApiClient } from '../../src/clients/users-api.client';
import {
  FIXTURE_USER_ID,
  FIXTURE_USER_FIRST_NAME,
  maxResponseMs,
} from '../../src/config/environment';
import { assertStatus, assertElapsedTime } from '../../src/helpers/assert-response';
import { CreateUserResponse, GetUserResponse } from '../../src/models/user.types';

test.describe('Reqres Users API', () => {
  test('Reqres Demo API — user create and fixture read', async ({ request }) => {
    const usersClient = new UsersApiClient(request);

    await test.step('POST /api/users — create user (echo, not persisted)', async () => {
      const payload = {
        name: `Jane Doe ${Date.now()}`,
        job: 'QA Engineer',
      };

      const { response: createRes, elapsedMs } = await usersClient.createUser(payload);
      await assertStatus(createRes, 201);
      assertElapsedTime(elapsedMs, maxResponseMs);

      const created = (await createRes.json()) as CreateUserResponse;
      expect(created.name).toBe(payload.name);
      expect(created.job).toBe(payload.job);
      expect(created.id).toBeTruthy();
      expect(created.createdAt).toBeTruthy();
    });

    await test.step('GET /api/users/2 — read guaranteed fixture user', async () => {
      const { response: getRes, elapsedMs } = await usersClient.getUserById(FIXTURE_USER_ID);
      await assertStatus(getRes, 200);
      assertElapsedTime(elapsedMs, maxResponseMs);

      const { data: user } = (await getRes.json()) as GetUserResponse;
      expect(user.id).toBe(FIXTURE_USER_ID);
      expect(user.first_name).toBe(FIXTURE_USER_FIRST_NAME);
      expect(user.email).toMatch(/@reqres\.in$/);
    });
  });
});
