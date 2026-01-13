import './Header.css';

function Header({ userName, onProfileClick, onLogout, onMenuClick, mobileMenuOpen }) {
    return (
        <header className="app-header">
            {/* Mobile Menu Button */}
            <button className="mobile-menu-btn" onClick={onMenuClick}>
                <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>

            <div className="logo">
                <span className="logo-icon">🍽️</span>
                <span className="logo-text">FOOD TIME</span>
            </div>
            <div className="header-actions">
                <div className="profile-bubble" onClick={onProfileClick}>
                    👤
                </div>
                <button className="logout-btn" onClick={onLogout}>
                    Çıkış
                </button>
            </div>
        </header>
    );
}

export default Header;
