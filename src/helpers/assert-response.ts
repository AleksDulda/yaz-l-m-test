import { APIResponse, expect } from '@playwright/test';

export async function assertStatus(
  response: APIResponse,
  expectedStatus: number,
): Promise<void> {
  expect(response.status()).toBe(expectedStatus);
}

export function assertElapsedTime(elapsedMs: number, maxMs: number): void {
  expect(
    elapsedMs,
    `Response time ${elapsedMs}ms exceeded limit of ${maxMs}ms`,
  ).toBeLessThan(maxMs);
}
