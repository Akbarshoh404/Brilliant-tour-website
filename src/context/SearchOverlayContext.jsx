/* eslint-disable react-refresh/only-export-components -- co-locates the provider with its consumer hook */
import { createContext, useContext, useMemo, useState } from 'react';
import SearchOverlay from '../components/SearchOverlay/SearchOverlay';

const SearchOverlayContext = createContext(null);

// Single shared instance of the search overlay (the command-palette style
// autocomplete), so both the navbar search icon and the Home hero search
// field open the same panel instead of routing to a dedicated results page.
export function SearchOverlayProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');

  const value = useMemo(
    () => ({
      openSearch: (query = '') => {
        setInitialQuery(query);
        setIsOpen(true);
      },
      closeSearch: () => setIsOpen(false),
    }),
    []
  );

  return (
    <SearchOverlayContext.Provider value={value}>
      {children}
      <SearchOverlay isOpen={isOpen} onClose={value.closeSearch} initialQuery={initialQuery} />
    </SearchOverlayContext.Provider>
  );
}

export function useSearchOverlay() {
  const ctx = useContext(SearchOverlayContext);
  if (!ctx) throw new Error('useSearchOverlay must be used within a SearchOverlayProvider');
  return ctx;
}
