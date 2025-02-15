import * as React from 'react';
import '@/lib/env';

import DiscoverProperties from '@/components/DiscoverProperties';
import FAQsAndBlogs from '@/components/FAQsAndBlogs';
import Footer from '@/components/Footer';
import KnowHouzie from '@/components/KnowHouzie';
import NavbarDetailsPage from '@/components/Navbars/NavbarDetailsPage';
import PropertyHero from '@/components/PropertyHero';
import StartJourney from '@/components/StartJourney';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function HomePage() {
  return (
    <main>
      <NavbarDetailsPage />
      <PropertyHero />
      <KnowHouzie />
      <DiscoverProperties />
      <StartJourney />
      <FAQsAndBlogs />
      <Footer />
      {/* <div className='flex flex-col items-center h-screen border-2'>
        <h1 className='text-black text-center font-inter text-6xl font-semibold leading-[90px] tracking-[-1.44px]'>
          Find your <a className=''>Perfect</a> Property
        </h1>
        <p>
          We can help you find your dream home by guiding you through a few
          simple steps and matching you with tailor-made property listings.
        </p>
        <div className='w-full'>
          <SearchBar />
        </div>
      </div> */}
    </main>
  );
}
