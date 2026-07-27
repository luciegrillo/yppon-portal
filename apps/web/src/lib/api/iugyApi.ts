import type {
  IugyEventsResponse,
  IugyInstitution,
  IugyInstitutionResponse,
  IugyNoticesResponse,
  IugyProgramsResponse,
  IugySelectionCycle,
  IugySelectionCycleResponse,
} from '@yppon/contracts/iugy';

const IUGY_API_ROOT = '/api/v1/iugy';
const FULL_COLLECTION_QUERY = 'pageSize=100';

export type IugyPageLoaderData = {
  events: Promise<IugyEventsResponse>;
  institution: Promise<IugyInstitution | null>;
  notices: Promise<IugyNoticesResponse>;
  programs: Promise<IugyProgramsResponse>;
  selectionCycle: Promise<IugySelectionCycle | null>;
};

export function loadIugyPageData(signal?: AbortSignal): IugyPageLoaderData {
  return {
    events: trackForRendering(getIugyEvents(signal)),
    institution: trackForRendering(getIugyInstitution(signal)),
    notices: trackForRendering(getIugyNotices(signal)),
    programs: trackForRendering(getIugyPrograms(signal)),
    selectionCycle: trackForRendering(getCurrentIugySelectionCycle(signal)),
  };
}

export async function getIugyInstitution(
  signal?: AbortSignal,
): Promise<IugyInstitution | null> {
  const response = await requestJson<IugyInstitutionResponse>(IUGY_API_ROOT, signal, {
    allowNotFound: true,
  });

  return response ? unwrapResource(response) : null;
}

export async function getIugyPrograms(
  signal?: AbortSignal,
): Promise<IugyProgramsResponse> {
  const response = await requestJson<IugyProgramsResponse>(
    `${IUGY_API_ROOT}/programs?${FULL_COLLECTION_QUERY}`,
    signal,
  );

  return requireCollection(response);
}

export async function getIugyNotices(signal?: AbortSignal): Promise<IugyNoticesResponse> {
  const response = await requestJson<IugyNoticesResponse>(
    `${IUGY_API_ROOT}/notices?${FULL_COLLECTION_QUERY}`,
    signal,
  );

  return requireCollection(response);
}

export async function getCurrentIugySelectionCycle(
  signal?: AbortSignal,
): Promise<IugySelectionCycle | null> {
  const response = await requestJson<IugySelectionCycleResponse>(
    `${IUGY_API_ROOT}/selection-cycles/current`,
    signal,
    { allowNotFound: true },
  );

  return response ? unwrapResource(response) : null;
}

export async function getIugyEvents(signal?: AbortSignal): Promise<IugyEventsResponse> {
  const response = await requestJson<IugyEventsResponse>(
    `${IUGY_API_ROOT}/events?current=true&${FULL_COLLECTION_QUERY}`,
    signal,
  );

  return requireCollection(response);
}

type RequestJsonOptions = {
  allowNotFound?: boolean;
};

function requestJson<T>(path: string, signal?: AbortSignal): Promise<T>;
function requestJson<T>(
  path: string,
  signal: AbortSignal | undefined,
  options: { allowNotFound: true },
): Promise<T | null>;
async function requestJson<T>(
  path: string,
  signal?: AbortSignal,
  { allowNotFound = false }: RequestJsonOptions = {},
): Promise<T | null> {
  const response = await fetch(path, {
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  if (allowNotFound && response.status === 404) return null;

  if (!response.ok) {
    throw new IugyApiError(response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new IugyApiError(response.status);
  }
}

function unwrapResource<T>(response: { data: T }): T {
  if (!isRecord(response) || !('data' in response)) {
    throw new IugyApiError(200);
  }

  return response.data;
}

function requireCollection<T extends { data: unknown[]; pagination: unknown }>(
  response: T,
): T {
  if (
    !isRecord(response) ||
    !Array.isArray(response.data) ||
    !isRecord(response.pagination)
  ) {
    throw new IugyApiError(200);
  }

  return response;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function trackForRendering<T>(request: Promise<T>): Promise<T> {
  void request.catch(() => undefined);
  return request;
}

export class IugyApiError extends Error {
  constructor(readonly status: number) {
    super('Não foi possível carregar o conteúdo público da IUGY.');
    this.name = 'IugyApiError';
  }
}
