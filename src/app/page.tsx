'use client';

import * as React from 'react';
import { Provider } from 'react-redux';
import '@/lib/env';

import DiscoverProperties from '@/components/DiscoverProperties';
import FAQsAndBlogs from '@/components/FAQsAndBlogs';
import Footer from '@/components/Footer';
import KnowHouzie from '@/components/KnowHouzie';
import NavbarDetailsPage from '@/components/Navbars/NavbarDetailsPage';
import PropertyHero from '@/components/PropertyHero';
import StartJourney from '@/components/StartJourney';

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
        <KnowHouzie />
        <DiscoverProperties />
        <StartJourney />
        <FAQsAndBlogs />
        <Footer />
      </main>
    </Provider>
  );
}
