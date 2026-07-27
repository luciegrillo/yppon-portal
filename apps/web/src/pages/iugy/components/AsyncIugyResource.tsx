import { Suspense, useState, type ReactNode } from 'react';
import { Await } from 'react-router';
import { trackForRendering } from '../../../lib/api/iugyApi';

type AsyncIugyResourceProps<T> = {
  children: (value: T) => ReactNode;
  error?: (retry: () => void) => ReactNode;
  errorMessage: string;
  load: () => Promise<T>;
  pending: ReactNode;
  request: Promise<T>;
};

const requestKeys = new WeakMap<Promise<unknown>, number>();
let nextRequestKey = 0;

export function AsyncIugyResource<T>(props: AsyncIugyResourceProps<T>) {
  return <AsyncIugyResourceInstance {...props} key={getRequestKey(props.request)} />;
}

function AsyncIugyResourceInstance<T>({
  children,
  error,
  errorMessage,
  load,
  pending,
  request,
}: AsyncIugyResourceProps<T>) {
  const [activeRequest, setActiveRequest] = useState(request);
  const retry = () => setActiveRequest(trackForRendering(load()));

  return (
    <Suspense fallback={pending}>
      <Await
        resolve={activeRequest}
        errorElement={
          error ? (
            error(retry)
          ) : (
            <IugyResourceState message={errorMessage} onRetry={retry} variant="error" />
          )
        }
      >
        {children}
      </Await>
    </Suspense>
  );
}

function getRequestKey(request: Promise<unknown>) {
  const currentKey = requestKeys.get(request);
  if (currentKey !== undefined) return currentKey;

  const key = nextRequestKey;
  nextRequestKey += 1;
  requestKeys.set(request, key);
  return key;
}

type IugyResourceStateProps = {
  message: string;
  onRetry?: () => void;
  variant: 'empty' | 'error' | 'loading';
};

export function IugyResourceState({ message, onRetry, variant }: IugyResourceStateProps) {
  return (
    <div
      aria-label={message}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={`iugy-resource-state iugy-resource-state--${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <p>{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry}>
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}

export function IugyCollectionSummary({
  shownItems,
  totalItems,
}: {
  shownItems: number;
  totalItems: number;
}) {
  if (shownItems >= totalItems) return null;

  return (
    <p className="iugy-collection-summary">
      Exibindo os primeiros {shownItems} de {totalItems} registros publicados.
    </p>
  );
}
