import type { LoaderFunctionArgs } from 'react-router';
import { loadIugyPageData, type IugyPageLoaderData } from '../../lib/api/iugyApi';

export function iugyPageLoader({ request }: LoaderFunctionArgs): IugyPageLoaderData {
  return loadIugyPageData(request.signal);
}
