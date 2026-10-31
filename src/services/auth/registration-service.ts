/** Frontend integration seam only; payload and endpoint require backend confirmation. */
export interface RegistrationInput {username: string; password: string}
export interface RegistrationService {
  register(input: RegistrationInput, signal?: AbortSignal): Promise<void>;
}

/** Continue only after the injected service confirms success; failures never navigate. */
export async function registerAndContinue(
  service: RegistrationService,
  input: RegistrationInput,
  onRegistered: () => void,
  signal?: AbortSignal,
): Promise<void> {
  await service.register(input, signal);
  if (!signal?.aborted) onRegistered();
}
export class RegistrationNotConfiguredError extends Error {
  constructor() {super('注册服务尚未接入'); this.name = 'RegistrationNotConfiguredError';}
}
export const registrationService: RegistrationService = {
  async register() {throw new RegistrationNotConfiguredError();},
};
