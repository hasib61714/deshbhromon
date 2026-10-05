import React, { useState, useEffect } from 'react';
import { Navbar, NavTabId } from './components/Navbar';
import { MapTracker } from './components/MapTracker';
import { DistrictGuide } from './components/DistrictGuide';
import { FoodExplorer } from './components/FoodExplorer';
import { TravelDiary } from './components/TravelDiary';
import { TripPlanner } from './components/TripPlanner';
import { TravelQuiz } from './components/TravelQuiz';
import { TravelSafetyAndSeasons } from './components/TravelSafetyAndSeasons';
import { WorldTracker } from './components/WorldTracker';
import { AboutModal } from './components/AboutModal';
import { TravelerCertificateModal } from './components/TravelerCertificateModal';
import { EmergencyHelpModal } from './components/EmergencyHelpModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>('map');
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isCertOpen, setIsCertOpen] = useState<boolean>(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);

  // Traveler name
  const [travelerName, setTravelerName] = useState<string>(() => {
    return localStorage.getItem('deshbhromon_traveler_name') || 'মোঃ হাসিবুল হাসান';
  });

  // Visited Districts Set
  const [visited, setVisited] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('deshbhromon_visited');
      return saved ? new Set(JSON.parse(saved)) : new Set(['Dhaka', 'Cox\'s Bazar', 'Sylhet', 'Bogura']);
    } catch {
      return new Set(['Dhaka', 'Cox\'s Bazar', 'Sylhet', 'Bogura']);
    }
  });

  // Wishlist Districts Set
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('deshbhromon_wishlist');
      return saved ? new Set(JSON.parse(saved)) : new Set(['Bandarban', 'Panchagarh', 'Sunamganj']);
    } catch {
      return new Set(['Bandarban', 'Panchagarh', 'Sunamganj']);
    }
  });

  // Visited World Countries Set
  const [visitedCountries, setVisitedCountries] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('deshbhromon_world');
      return saved ? new Set(JSON.parse(saved)) : new Set(['BD']);
    } catch {
      return new Set(['BD']);
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('deshbhromon_visited', JSON.stringify([...visited]));
  }, [visited]);

  useEffect(() => {
    localStorage.setItem('deshbhromon_wishlist', JSON.stringify([...wishlist]));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('deshbhromon_world', JSON.stringify([...visitedCountries]));
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
        {activeTab === 'map' && (
          <MapTracker
            visited={visited}
            wishlist={wishlist}
            onToggleVisited={handleToggleVisited}
            onToggleWishlist={handleToggleWishlist}
            onSelectAll={handleSelectAllVisited}
            onClearAll={handleClearAllVisited}
            onOpenCertificate={() => setIsCertOpen(true)}
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
      </main>

      {/* Footer */}
      <Footer
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        setActiveTab={setActiveTab as any}
      />

      {/* Creator Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Traveler Certificate Modal */}
      <TravelerCertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        travelerName={travelerName}
        visitedCount={visited.size}
        wishlistCount={wishlist.size}
      />

      {/* Emergency Helpline Modal */}
      <EmergencyHelpModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />
    </div>
  );
}
