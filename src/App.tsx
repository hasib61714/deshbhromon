import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Navbar, NavTabId } from './components/Navbar';
const MapTracker = lazy(() => import('./components/MapTracker').then((m) => ({ default: m.MapTracker })));
const DistrictGuide = lazy(() => import('./components/DistrictGuide').then((m) => ({ default: m.DistrictGuide })));
const FoodExplorer = lazy(() => import('./components/FoodExplorer').then((m) => ({ default: m.FoodExplorer })));
const TravelDiary = lazy(() => import('./components/TravelDiary').then((m) => ({ default: m.TravelDiary })));
const TripPlanner = lazy(() => import('./components/TripPlanner').then((m) => ({ default: m.TripPlanner })));
const TravelQuiz = lazy(() => import('./components/TravelQuiz').then((m) => ({ default: m.TravelQuiz })));
const TravelSafetyAndSeasons = lazy(() => import('./components/TravelSafetyAndSeasons').then((m) => ({ default: m.TravelSafetyAndSeasons })));
const WorldTracker = lazy(() => import('./components/WorldTracker').then((m) => ({ default: m.WorldTracker })));
const AboutModal = lazy(() => import('./components/AboutModal').then((m) => ({ default: m.AboutModal })));
const TravelerCertificateModal = lazy(() => import('./components/TravelerCertificateModal').then((m) => ({ default: m.TravelerCertificateModal })));
const EmergencyHelpModal = lazy(() => import('./components/EmergencyHelpModal').then((m) => ({ default: m.EmergencyHelpModal })));
import { Footer } from './components/Footer';
import { readString, readStringSet, writeString, writeStringSet } from './lib/storage';

const TAB_IDS: NavTabId[] = ['map', 'guide', 'food', 'diary', 'plan', 'quiz', 'safety', 'world'];
function tabFromHash(): NavTabId {
  const id = window.location.hash.replace('#', '');
  return (TAB_IDS as string[]).includes(id) ? (id as NavTabId) : 'map';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>(tabFromHash);

  // Keep the tab in the URL hash so refresh, back/forward and shared links work
  useEffect(() => {
    if (window.location.hash !== `#${activeTab}`) window.history.pushState(null, '', `#${activeTab}`);
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
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);

  // Traveler name
  const [travelerName, setTravelerName] = useState<string>(() =>
    readString('traveler_name', '')
  );

  // Visited / wishlist districts and visited world countries (start empty for every new traveler)
  const [visited, setVisited] = useState<Set<string>>(() => readStringSet('visited'));
  const [wishlist, setWishlist] = useState<Set<string>>(() => readStringSet('wishlist'));
  const [visitedCountries, setVisitedCountries] = useState<Set<string>>(() => readStringSet('world'));

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
        // If adding to visited, remove from wishlist
        setWishlist((wPrev) => {
          const wNext = new Set(wPrev);
          wNext.delete(district);
          return wNext;
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
        // If adding to wishlist, remove from visited
        setVisited((vPrev) => {
          const vNext = new Set(vPrev);
          vNext.delete(district);
          return vNext;
        });
      }
      return next;
    });
  };

  const handleSelectAllVisited = () => {
    import('./data/map-data').then(({ DATA }) => {
      setVisited(new Set(DATA.f.map((f) => f.n)));
      setWishlist(new Set());
    });
  };

  const handleClearAllVisited = () => {
    setVisited(new Set());
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
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        visitedCount={visited.size}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div role="status" aria-live="polite" className="py-24 text-center text-stone-500 text-sm">লোড হচ্ছে…</div>}>
        {activeTab === 'map' && (
          <MapTracker
            visited={visited}
            wishlist={wishlist}
            onToggleVisited={handleToggleVisited}
            onToggleWishlist={handleToggleWishlist}
            onSelectAll={handleSelectAllVisited}
            onClearAll={handleClearAllVisited}
            onOpenCertificate={() => setIsCertOpen(true)}
            travelerName={travelerName}
            onTravelerNameChange={setTravelerName}
          />
        )}

        {activeTab === 'guide' && (
          <DistrictGuide
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
            onMarkVisited={(dist) => {
              setVisited((prev) => new Set([...prev, dist]));
            }}
          />
        )}

        {activeTab === 'plan' && <TripPlanner />}

        {activeTab === 'quiz' && <TravelQuiz />}

        {activeTab === 'safety' && <TravelSafetyAndSeasons />}

        {activeTab === 'world' && (
          <WorldTracker
            visitedCountries={visitedCountries}
            onToggleCountry={handleToggleCountry}
            onClearCountries={handleClearCountries}
          />
        )}
        </Suspense>
      </main>

      {/* Footer */}
      <Footer
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        setActiveTab={setActiveTab as any}
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
        visitedCount={visited.size}
        wishlistCount={wishlist.size}
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
