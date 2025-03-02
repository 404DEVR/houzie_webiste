'use client';

import * as React from 'react';
import { Provider } from 'react-redux';
import '@/lib/env';

import DiscoverProperties from '@/components/DiscoverProperties';
import FAQsAndBlogs from '@/components/FAQsAndBlogs';
import Footer from '@/components/Footer';
import ExploreHouzie from '@/components/Hero/ExploreHouzie';
import Howitworks from '@/components/Hero/Howitworks';
import PropertyHero from '@/components/Hero/PropertyHero';
import KnowHouzie from '@/components/KnowHouzie';
import NavbarDetailsPage from '@/components/Navbars/NavbarDetailsPage';
import StartJourney from '@/components/StartJourney';

import store from '@/redux/store';
import FeatureHero from '@/components/Hero/FeatureHero';
import SmartSearchSection from '@/components/Hero/SmartSearchSection';
import ComparisonTable from '@/components/Hero/ComparisonTable';
import StatsSection from '@/components/Hero/StatsSection';
import ExploreHeroSection from '@/components/Hero/ExploreHeroSection';

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
        {/* <KnowHouzie />
        <DiscoverProperties />
        <StartJourney />
        <FAQsAndBlogs /> */}
        <Footer />
      </main>
    </Provider>
  );
}
