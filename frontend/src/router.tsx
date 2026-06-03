import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';

interface RouterContextValue {
  path: string;
  params: Record<string, string>;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue>({
  path: '/',
  params: {},
  navigate: () => {},
});

export function useRouter() {
  return useContext(RouterContext);
}

function parseHash(): { path: string; params: Record<string, string> } {
  let hash = window.location.hash.slice(1) || '/';

  // Strip query string for path matching
  const qIdx = hash.indexOf('?');
  if (qIdx !== -1) hash = hash.substring(0, qIdx);

  // Match /colleges/:id
  const detailMatch = hash.match(/^\/colleges\/(.+)$/);
  if (detailMatch) {
    return { path: '/colleges/:id', params: { id: detailMatch[1] } };
  }

  return { path: hash, params: {} };
}

export function Router({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (to: string) => {
    window.location.hash = to;
  };

  return (
    <RouterContext.Provider value={{ ...route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}
