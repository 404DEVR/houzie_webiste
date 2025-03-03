'use client';

import * as React from 'react';
import { Provider } from 'react-redux';
import '@/lib/env';

import Footer from '@/components/Footer';
import ComparisonTable from '@/components/Hero/ComparisonTable';
import ExploreHeroSection from '@/components/Hero/ExploreHeroSection';
import ExploreHouzie from '@/components/Hero/ExploreHouzie';
import FeatureHero from '@/components/Hero/FeatureHero';
import Howitworks from '@/components/Hero/Howitworks';
import PropertyHero from '@/components/Hero/PropertyHero';
import SmartSearchSection from '@/components/Hero/SmartSearchSection';
import StatsSection from '@/components/Hero/StatsSection';
import NavbarDetailsPage from '@/components/Navbars/NavbarDetailsPage';

import store from '@/redux/store';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function HomePage() {
  return (
    <Provider store={store}>
      <main>
        <NavbarDetailsPage />
        <PropertyHero />
        <ExploreHouzie />
        <Howitworks />
        <FeatureHero />
        <SmartSearchSection />
        <ComparisonTable />
        <StatsSection />
        <ExploreHeroSection />
        <Footer />
      </main>
    </Provider>
  );
}
