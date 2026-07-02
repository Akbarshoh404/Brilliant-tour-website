/* eslint-disable react-refresh/only-export-components -- centralized lazy route config, not a component file */
import { lazy } from 'react';

const Home = lazy(() => import('../pages/Home/Home'));
const InternationalHub = lazy(() => import('../pages/InternationalHub/InternationalHub'));
const CountryPage = lazy(() => import('../pages/CountryPage/CountryPage'));
const CityPage = lazy(() => import('../pages/CityPage/CityPage'));
const DomesticHub = lazy(() => import('../pages/DomesticHub/DomesticHub'));
const DomesticCategoryPage = lazy(() => import('../pages/DomesticCategoryPage/DomesticCategoryPage'));
const CollectionPage = lazy(() => import('../pages/CollectionPage/CollectionPage'));
const OfferDetail = lazy(() => import('../pages/OfferDetail/OfferDetail'));
const SearchResults = lazy(() => import('../pages/SearchResults/SearchResults'));
const About = lazy(() => import('../pages/About/About'));
const Contact = lazy(() => import('../pages/Contact/Contact'));

export const routes = [
  { path: '/', element: Home },
  { path: '/international', element: InternationalHub },
  { path: '/international/:countrySlug', element: CountryPage },
  { path: '/international/:countrySlug/:citySlug', element: CityPage },
  { path: '/domestic', element: DomesticHub },
  { path: '/domestic/:categorySlug', element: DomesticCategoryPage },
  { path: '/collections/:tag', element: CollectionPage },
  { path: '/tours/:offerSlug', element: OfferDetail },
  { path: '/search', element: SearchResults },
  { path: '/about', element: About },
  { path: '/contact', element: Contact },
];
