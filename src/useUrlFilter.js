import { useEffect, useState } from 'react';

export const FILTERS = ['all', 'active', 'completed'];


function getFilterFromUrl() {
  const filter = new URLSearchParams(window.location.search).get('filter');
  return FILTERS.includes(filter) ? filter : 'all';
}


function makeUrl(filter) {
  const params = new URLSearchParams(window.location.search);

  if (filter === 'all') {
    params.delete('filter');
  } else {
    params.set('filter', filter);
  }

  const query = params.toString();
  return query ? `${window.location.pathname}?${query}` : window.location.pathname;
}

export function useUrlFilter() {
  const [filter, setFilter] = useState(getFilterFromUrl);

  useEffect(() => {
    const url = makeUrl(filter);
    if (url !== window.location.pathname + window.location.search) {
      window.history.pushState({}, '', url);
    }
  }, [filter]);


  useEffect(() => {
    const onPopState = () => setFilter(getFilterFromUrl());

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return [filter, setFilter];
}
