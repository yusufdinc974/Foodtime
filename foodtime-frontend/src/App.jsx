import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import WelcomeScreen from './components/WelcomeScreen';
import Header from './components/Header';
import ProfileModal from './components/ProfileModal';
import Dashboard from './components/Dashboard';
import DailyAnalysis from './components/DailyAnalysis';
import FoodQuery from './components/FoodQuery';
import PhotoAnalysis from './components/PhotoAnalysis';
import Reports from './components/Reports';
import ResultPanel from './components/ResultPanel';
import AuthPage from './components/AuthPage';
import './App.css';

function MainApp() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [activeTitle, setActiveTitle] = useState('DASHBOARD');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleTabSwitch = (tab, title) => {
        setActiveTab(tab);
        setActiveTitle(title);
        setAnalysisResult(null);
        setMobileMenuOpen(false); // Close menu on tab switch
    };
    const handleLogout = () => {
        logout();
    };

    return (
        <div className="app">
            {/* welcomeVisible and profileModalOpen are not defined in MainApp, assuming they are managed elsewhere or removed */}
            {/* {welcomeVisible && <WelcomeScreen onStart={handleStartSystem} />} */}

            <ProfileModal
                isOpen={showProfile}
                onClose={() => setShowProfile(false)}
            />

            <Header
                userName={user?.name}
                onProfileClick={() => setShowProfile(true)}
                onLogout={logout}
                onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                mobileMenuOpen={mobileMenuOpen}
            />

            <main className="main-content">
                <div className="left-side">
                    {/* Mobile Menu Overlay */}
                    {mobileMenuOpen && (
                        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
                            <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className={`mobile-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                                    onClick={() => handleTabSwitch('dashboard', 'DASHBOARD')}
                                >
                                    DASHBOARD
                                </button>
                                <button
                                    className={`mobile-tab-btn ${activeTab === 'gunluk' ? 'active' : ''}`}
                                    onClick={() => handleTabSwitch('gunluk', 'GÜNLÜK ANALİZ')}
                                >
                                    GÜNLÜK ANALİZ
                                </button>
                                <button
                                    className={`mobile-tab-btn ${activeTab === 'besin' ? 'active' : ''}`}
                                    onClick={() => handleTabSwitch('besin', 'BESİN SORGU')}
                                >
                                    BESİN SORGU
                                </button>
                                <button
                                    className={`mobile-tab-btn ${activeTab === 'foto' ? 'active' : ''}`}
                                    onClick={() => handleTabSwitch('foto', 'FOTO ANALİZ')}
                                >
                                    FOTO ANALİZ
                                </button>
                                <button
                                    className={`mobile-tab-btn ${activeTab === 'raporlar' ? 'active' : ''}`}
                                    onClick={() => handleTabSwitch('raporlar', 'RAPORLAR')}
                                >
                                    RAPORLAR
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Desktop Tabs */}
                    <div className="tabs desktop-only">
                        <button
                            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => handleTabSwitch('dashboard', 'DASHBOARD')}
                        >
                            DASHBOARD
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'gunluk' ? 'active' : ''}`}
                            onClick={() => handleTabSwitch('gunluk', 'GÜNLÜK ANALİZ')}
                        >
                            GÜNLÜK ANALİZ
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'besin' ? 'active' : ''}`}
                            onClick={() => handleTabSwitch('besin', 'BESİN SORGU')}
                        >
                            BESİN SORGU
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'foto' ? 'active' : ''}`}
                            onClick={() => handleTabSwitch('foto', 'FOTO ANALİZ')}
                        >
                            FOTO ANALİZ
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'raporlar' ? 'active' : ''}`}
                            onClick={() => handleTabSwitch('raporlar', 'RAPORLAR')}
                        >
                            RAPORLAR
                        </button>
                    </div>

                    <div className="sections">
                        {activeTab === 'dashboard' && <Dashboard />}
                        {activeTab === 'gunluk' && <DailyAnalysis onResult={setAnalysisResult} />}
                        {activeTab === 'besin' && <FoodQuery onResult={setAnalysisResult} />}
                        {activeTab === 'foto' && <PhotoAnalysis onResult={setAnalysisResult} />}
                        {activeTab === 'raporlar' && <Reports />}
                    </div>
                </div>

                {activeTab !== 'dashboard' && activeTab !== 'raporlar' && (
                    <ResultPanel title={activeTitle} result={analysisResult} />
                )}
            </main>
        </div>
    );
}

function App() {
    const [showWelcome, setShowWelcome] = useState(true);

    return (
        <AuthProvider>
            <AppContent showWelcome={showWelcome} setShowWelcome={setShowWelcome} />
        </AuthProvider>
    );
}

function AppContent({ showWelcome, setShowWelcome }) {
    const { user } = useAuth();

    // Skip welcome screen if user is already logged in
    useEffect(() => {
        if (user && showWelcome) {
            setShowWelcome(false);
        }
    }, [user, showWelcome, setShowWelcome]);

    if (showWelcome && !user) {
        return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
    }

    return user ? <MainApp /> : <AuthPage />;
}

export default App;
