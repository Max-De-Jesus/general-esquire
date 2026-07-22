import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type ContentData = {
  [key: string]: {
    title: string;
    content: string;
  };
};

const PAGE_PHOTOS: Record<string, { hero: string; gallery: string[] }> = {
  'entrepreneur': {
    hero: "/images/Chef d'entreprise3.jpg",
    gallery: ["/images/Chef d'entreprise4.jpg", "/images/Chef d'entreprise7.jpg", "/images/chef.jpg"]
  },
  'excursions': {
    hero: '/images/excursion1.jpg',
    gallery: ['/images/Excursion4.jpg', '/images/Excursion9.jpg', '/images/Excursion12.jpg']
  },
  'repas': {
    hero: '/images/Food.jpg',
    gallery: ['/images/food3.jpg', '/images/food7.jpg', '/images/food10.jpg']
  },
  'hebergement': {
    hero: '/images/sejour15.jpg',
    gallery: ['/images/sejour14.jpg', '/images/Dormir.jpg', '/images/Repos.jpg']
  },
  'institution': {
    hero: '/images/Drapeaux-du-monde.jpg',
    gallery: ['/images/Board image.jpg', '/images/Drapeaux-du-monde.jpg', '/images/Badge Hauts de France.png']
  }
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const dataPath = path.join(process.cwd(), 'src/data/content.json');
  let data: ContentData = {};
  
  try {
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    data = JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading content.json", error);
  }

  const slugMap: Record<string, string> = {
    'articuliers': 'articuliers',
    'cocooning-touristique': 'cocooning touristique',
    'entrepreneur': 'entrepreneur',
    'excursions': 'excursions',
    'hebergement': 'hebergement',
    'institution': 'institution',
    'professionnel': 'professionnel',
    'repas': 'repas'
  };

  const jsonKey = slugMap[slug];
  const pageData = jsonKey ? data[jsonKey] : null;

  if (!pageData) {
    notFound();
  }

  // Clean OCR text artifacts
  const cleanContent = pageData.content
    .replace(/Ɵ/g, 'ti')
    .replace(/\u00a7/g, '•')
    .replace(/\n\s*\n/g, '\n\n')
    .split('\n\n')
    .filter(p => p.trim() !== '');

  const photos = PAGE_PHOTOS[slug];

  return (
    <div className="min-h-screen bg-[#1a1c1a] text-[#EDE4CF] py-12 md:py-20 relative">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Filigrane Background */}
        <div className="absolute inset-0 -z-10 opacity-15 overflow-hidden pointer-events-none">
          <Image
            src="/images/background.jpeg"
            alt="Fond Filigrane"
            fill
            className="object-cover object-center filter brightness-75 contrast-125"
          />
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 font-cinzel text-xs text-[#C5A059] mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-[#E9D18F] transition-colors">Accueil</Link>
          <span>/</span>
          <span className="text-[#EDE4CF]">{pageData.title}</span>
        </div>

        {/* Hero Header Banner if photos exist */}
        {photos && (
          <div className="relative rounded-3xl overflow-hidden border border-[#C5A059]/40 mb-12 shadow-2xl">
            <div className="relative h-64 sm:h-80 md:h-96 w-full">
              <Image
                src={photos.hero}
                alt={pageData.title}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center filter brightness-90 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c1a] via-[#1a1c1a]/50 to-transparent"></div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10">
              <span className="text-[#C5A059] text-xs font-cinzel tracking-widest uppercase bg-[#131513]/80 px-4 py-1 rounded-full border border-[#C5A059]/40 backdrop-blur-md">
                Rubrique & Service
              </span>
              <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold tracking-wider text-white mt-3 drop-shadow-md">
                {pageData.title}
              </h1>
            </div>
          </div>
        )}

        {!photos && (
          <div className="mb-12 border-b border-[#C5A059]/30 pb-8 text-center">
            <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] mb-4">
              {pageData.title}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[2px] w-20 bg-gradient-to-r from-[#C5A059] to-transparent"></div>
              <span className="text-[#C5A059] text-xs">◆</span>
              <div className="h-[2px] w-20 bg-gradient-to-l from-[#C5A059] to-transparent"></div>
            </div>
          </div>
        )}

        {/* Main Article Content */}
        <div className="bg-[#131513]/90 border border-[#C5A059]/25 rounded-2xl p-8 sm:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden mb-12">
          <div className="space-y-6 font-cormorant text-lg sm:text-xl text-[#EDE4CF]/90 leading-relaxed font-light">
            {cleanContent.map((paragraph, index) => (
              <p key={index} className="first-letter:text-3xl first-letter:font-cinzel first-letter:text-[#C5A059] first-letter:font-bold">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Balanced and Centered Gallery */}
        {photos && photos.gallery.length > 0 && (
          <section className="mb-12">
            <div className="text-center mb-8">
              <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
                Galerie de Photos
              </span>
              <h2 className="font-cinzel text-2xl md:text-3xl text-[#E9D18F]">
                Aperçu & Découverte
              </h2>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6">
              {photos.gallery.map((imgSrc, i) => (
                <div
                  key={i}
                  className="relative w-full sm:w-[calc(33.333%-1rem)] max-w-sm h-64 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg group"
                >
                  <Image
                    src={imgSrc}
                    alt={`${pageData.title} ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Action / Contact Card */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#0F3823]/60 via-[#131513] to-[#0F3823]/60 border border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h4 className="font-cinzel text-base text-[#E9D18F] font-semibold mb-1">Besoin d'un accompagnement ?</h4>
            <p className="font-cormorant text-sm text-[#cabfa6]">Notre cabinet se tient à votre entière disposition.</p>
          </div>
          <a
            href="mailto:contact@generalesquire.com"
            className="px-8 py-3 rounded-full font-cinzel text-xs tracking-widest uppercase font-semibold text-black bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] hover:brightness-110 transition-all shadow-lg hover:scale-105"
          >
            Contactez-nous
          </a>
        </div>

      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { slug: 'articuliers' },
    { slug: 'cocooning-touristique' },
    { slug: 'entrepreneur' },
    { slug: 'excursions' },
    { slug: 'hebergement' },
    { slug: 'institution' },
    { slug: 'repas' }
  ];
}
