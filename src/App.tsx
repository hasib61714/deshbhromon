import { districtFromPath } from './lib/districtRoutes';
import { DISTRICT_DETAILS } from './data/bangladesh-data';
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Navbar, NavTabId } from './components/Navbar';
const HomePage = lazy(() => import('./components/HomePage').then((m) => ({ default: m.HomePage })));
const MapTracker = lazy(() => import('./components/MapTracker').then((m) => ({ default: m.MapTracker })));
const DistrictGuide = lazy(() => import('./components/DistrictGuide').then((m) => ({ default: m.DistrictGuide })));
const FoodExplorer = lazy(() => import('./components/FoodExplorer').then((m) => ({ default: m.FoodExplorer })));
const TravelDiary = lazy(() => import('./components/TravelDiary').then((m) => ({ default: m.TravelDiary })));
const TripPlanner = lazy(() => import('./components/TripPlanner').then((m) => ({ default: m.TripPlanner })));
const GamesHub = lazy(() => import('./components/GamesHub').then((m) => ({ default: m.GamesHub })));
const TravelSafetyAndSeasons = lazy(() => import('./components/TravelSafetyAndSeasons').then((m) => ({ default: m.TravelSafetyAndSeasons })));
const WorldTracker = lazy(() => import('./components/WorldTracker').then((m) => ({ default: m.WorldTracker })));
const HiddenGems = lazy(() => import('./components/HiddenGems').then((m) => ({ default: m.HiddenGems })));
const AboutModal = lazy(() => import('./components/AboutModal').then((m) => ({ default: m.AboutModal })));
const TravelerCertificateModal = lazy(() => import('./components/TravelerCertificateModal').then((m) => ({ default: m.TravelerCertificateModal })));
const TravelCardModal = lazy(() => import('./components/TravelCardModal').then((m) => ({ default: m.TravelCardModal })));
const EmergencyHelpModal = lazy(() => import('./components/EmergencyHelpModal').then((m) => ({ default: m.EmergencyHelpModal })));
import { Footer } from './components/Footer';
import { readString, readStringSet, writeString, writeStringSet } from './lib/storage';
import { migrateCountryIds } from './lib/world';

const TAB_IDS: NavTabId[] = ['home', 'map', 'guide', 'food', 'diary', 'plan', 'quiz', 'safety', 'world', 'gems'];
const TAB_TITLES: Record<NavTabId, string> = {
  home: 'দেশভ্রমণ (DeshBhromon) — বাংলাদেশ ভ্রমণ মানচিত্র ও ৬৪ জেলা গাইড',
  guide: 'জেলা গাইড | দেশভ্রমণ',
  map: 'আমার ভ্রমণ ম্যাপ | দেশভ্রমণ',
  plan: 'ট্রিপ প্ল্যানার | দেশভ্রমণ',
  diary: 'ভ্রমণ ডায়েরি | দেশভ্রমণ',
  food: 'ফুড ট্র্যাকার | দেশভ্রমণ',
  safety: 'ঋতু ও নিরাপত্তা | দেশভ্রমণ',
  quiz: 'কুইজ খেলা | দেশভ্রমণ',
  world: 'বিশ্ব ভ্রমণ মানচিত্র | দেশভ্রমণ',
  gems: 'আমার এলাকা | দেশভ্রমণ',
};

// Arriving on /district/<name>/ (a shared or searched link) opens that district in the guide
function districtFromLocation(): string | null {
  return districtFromPath(window.location.pathname, Object.keys(DISTRICT_DETAILS));
}

function tabFromHash(): NavTabId {
  if (districtFromLocation() && !window.location.hash) return 'guide';
  const id = window.location.hash.replace('#', '');
  return (TAB_IDS as string[]).includes(id) ? (id as NavTabId) : 'home';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>(tabFromHash);

  // Where the guide should open when arriving from the home page
  const [guideFocus, setGuideFocus] = useState<{ division: string; district: string | null; key: number }>(() => ({ division: 'all', district: districtFromLocation(), key: 0 }));

  const openGuide = (division: string, district: string | null) => {
    setGuideFocus((g) => ({ division, district, key: g.key + 1 }));
    setActiveTab('guide');
  };

  // Keep the tab in the URL hash so refresh, back/forward and shared links work
  useEffect(() => {
    if (window.location.hash !== `#${activeTab}`) {
      // First visit without a hash should not add a history entry
      const method = window.location.hash ? 'pushState' : 'replaceState';
      window.history[method](null, '', `#${activeTab}`);
    }
    document.title = TAB_TITLES[activeTab];
    window.scrollTo({ top: 0 });
  }, [activeTab]);

  useEffect(() => {
    const onHash = () => setActiveTab(tabFromHash());
    window.addEventListener('hashchange', onHash);
    window.addEventListener('popstate', onHash);
    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('popstate', onHash);
    };
  }, []);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isCertOpen, setIsCertOpen] = useState<boolean>(false);
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);

  // Traveler name
  const [travelerName, setTravelerName] = useState<string>(() =>
    readString('traveler_name', '')
  );

  // Visited / wishlist districts and visited world countries (start empty for every new traveler)
  const [visited, setVisited] = useState<Set<string>>(() => readStringSet('visited'));
  const [wishlist, setWishlist] = useState<Set<string>>(() => readStringSet('wishlist'));
  // Districts only travelled through (not a stop) and special places such as Saint Martin's Island
  const [passed, setPassed] = useState<Set<string>>(() => readStringSet('passed'));
  const [islands, setIslands] = useState<Set<string>>(() => readStringSet('islands'));
  const [visitedCountries, setVisitedCountries] = useState<Set<string>>(() => migrateCountryIds(readStringSet('world')));

  // Sync to LocalStorage
  useEffect(() => {
    writeString('traveler_name', travelerName);
  }, [travelerName]);

  useEffect(() => {
    writeStringSet('visited', visited);
  }, [visited]);

  useEffect(() => {
    writeStringSet('wishlist', wishlist);
  }, [wishlist]);

  useEffect(() => {
    writeStringSet('passed', passed);
  }, [passed]);

  useEffect(() => {
    writeStringSet('islands', islands);
  }, [islands]);

  useEffect(() => {
    writeStringSet('world', visitedCountries);
  }, [visitedCountries]);

  // Handlers
  const handleToggleVisited = (district: string) => {
    setVisited((prev) => {
      const next = new Set(prev);
      if (next.has(district)) {
        next.delete(district);
      } else {
        next.add(district);
        // If adding to visited, remove from wishlist and from "passed through"
        setWishlist((wPrev) => {
          const wNext = new Set(wPrev);
          wNext.delete(district);
          return wNext;
        });
        setPassed((pPrev) => {
          const pNext = new Set(pPrev);
          pNext.delete(district);
          return pNext;
        });
      }
      return next;
    });
  };

  const handleToggleWishlist = (district: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(district)) {
        next.delete(district);
      } else {
        next.add(district);
        // If adding to wishlist, remove from visited and from "passed through"
        setVisited((vPrev) => {
          const vNext = new Set(vPrev);
          vNext.delete(district);
          return vNext;
        });
        setPassed((pPrev) => {
          const pNext = new Set(pPrev);
          pNext.delete(district);
          return pNext;
        });
      }
      return next;
    });
  };

  // "Passed through on the way": a third, separate state (never counted as visited)
  const handleTogglePassed = (district: string) => {
    setPassed((prev) => {
      const next = new Set(prev);
      if (next.has(district)) {
        next.delete(district);
      } else {
        next.add(district);
        setVisited((vPrev) => {
          const vNext = new Set(vPrev);
          vNext.delete(district);
          return vNext;
        });
        setWishlist((wPrev) => {
          const wNext = new Set(wPrev);
          wNext.delete(district);
          return wNext;
        });
      }
      return next;
    });
  };

  const handleToggleIsland = (id: string) => {
    setIslands((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllVisited = () => {
    import('./data/map-data').then(({ DATA }) => {
      setVisited(new Set(DATA.f.map((f) => f.n)));
      setWishlist(new Set());
      setPassed(new Set());
    });
  };

  const handleClearAllVisited = () => {
    setVisited(new Set());
    setPassed(new Set());
    setIslands(new Set());
  };

  const handleToggleCountry = (countryId: string) => {
    setVisitedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(countryId)) {
        next.delete(countryId);
      } else {
        next.add(countryId);
      }
      return next;
    });
  };

  const handleClearCountries = () => {
    setVisitedCountries(new Set());
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-sans flex flex-col selection:bg-emerald-200 selection:text-emerald-950">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        visitedCount={visited.size}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div role="status" aria-live="polite" className="min-h-[100svh] pt-24 text-center text-stone-500 text-sm">লোড হচ্ছে…</div>}>
        {activeTab === 'home' && (
          <HomePage
            visited={visited}
            wishlist={wishlist}
            onNavigate={(tab) => {
              if (tab === 'guide') openGuide('all', null);
              else setActiveTab(tab);
            }}
            onOpenDivision={(dv) => openGuide(dv, null)}
            onOpenDistrict={(id) => openGuide('all', id)}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onOpenAbout={() => setIsAboutOpen(true)}
          />
        )}

        {activeTab === 'map' && (
          <MapTracker
            visited={visited}
            wishlist={wishlist}
            onToggleVisited={handleToggleVisited}
            onToggleWishlist={handleToggleWishlist}
            passed={passed}
            onTogglePassed={handleTogglePassed}
            islands={islands}
            onToggleIsland={handleToggleIsland}
            onSelectAll={handleSelectAllVisited}
            onClearAll={handleClearAllVisited}
            onOpenCertificate={() => setIsCertOpen(true)}
            onOpenTravelCard={() => setIsCardOpen(true)}
            travelerName={travelerName}
            onTravelerNameChange={setTravelerName}
          />
        )}

        {activeTab === 'guide' && (
          <DistrictGuide
            key={guideFocus.key}
            initialDivision={guideFocus.division}
            initialDistrict={guideFocus.district}
            visited={visited}
            wishlist={wishlist}
            onToggleVisited={handleToggleVisited}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeTab === 'food' && <FoodExplorer />}

        {activeTab === 'diary' && (
          <TravelDiary
            visited={visited}
            onOpenTravelCard={() => setIsCardOpen(true)}
            onMarkVisited={(dist) => {
              setVisited((prev) => new Set([...prev, dist]));
            }}
          />
        )}

        {activeTab === 'plan' && <TripPlanner />}

        {activeTab === 'quiz' && <GamesHub />}

        {activeTab === 'safety' && <TravelSafetyAndSeasons />}

        {activeTab === 'world' && (
          <WorldTracker
            visitedCountries={visitedCountries}
            onToggleCountry={handleToggleCountry}
            onClearCountries={handleClearCountries}
          />
        )}

        {activeTab === 'gems' && <HiddenGems />}
        </Suspense>
      </main>

      {/* Footer */}
      <Footer
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        setActiveTab={setActiveTab}
      />

      <Suspense fallback={null}>
      {/* Creator Modal */}
      {isAboutOpen && <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />}

      {/* Traveler Certificate Modal */}
      {isCertOpen && <TravelerCertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        travelerName={travelerName}
        onTravelerNameChange={setTravelerName}
        visitedCount={visited.size}
        wishlistCount={wishlist.size}
      />}

      {/* Personal Travel Card (Facebook image) */}
      {isCardOpen && <TravelCardModal
        onClose={() => setIsCardOpen(false)}
        travelerName={travelerName}
        onTravelerNameChange={setTravelerName}
        visited={visited}
        wishlist={wishlist}
        countries={visitedCountries}
      />}

      {/* Emergency Helpline Modal */}
      {isEmergencyOpen && <EmergencyHelpModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />}
      </Suspense>
    </div>
  );
}
