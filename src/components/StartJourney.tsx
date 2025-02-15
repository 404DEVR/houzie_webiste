import Image from 'next/image';

export default function StartJourney() {
  return (
    <div className='relative overflow-hidden'>
      <div className='absolute left-0 top-0 -z-10 opacity-100'>
        <Image
          src='/svg/Abstract Design (1).svg'
          alt='Left pattern'
          width={500}
          height={500}
          className='object-contain md:scale-125'
        />
      </div>

      <div className='absolute right-0 bottom-0 -z-10 opacity-100'>
        <Image
          src='/svg/Abstract Design.svg'
          alt='Right pattern'
          width={500}
          height={500}
          className='object-contain md:scale-125'
        />
      </div>

      <div className='flex flex-col md:flex-row max-w-6xl mx-auto justify-between items-start md:items-center gap-8 px-4 py-16'>
        <div className='max-w-2xl'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Start Your Real Estate Journey Today
          </h2>
          <p className='text-gray-600 leading-relaxed'>
            Your dream property is just a click away. Whether you're looking for
            a new home, a strategic investment, or expert real estate advice,
            Estatein is here to assist you every step of the way. Take the first
            step towards your real estate goals and explore our available
            properties or get in touch with our team for personalized
            assistance.
          </p>
        </div>

        <button className='bg-[#5CC1B1] hover:bg-[#4BA99B] text-white px-8 py-3 rounded-md transition-colors whitespace-nowrap'>
          Explore Properties
        </button>
      </div>
    </div>
  );
}
