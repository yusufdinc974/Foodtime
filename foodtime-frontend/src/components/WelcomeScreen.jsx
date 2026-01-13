import './WelcomeScreen.css';

function WelcomeScreen({ onStart }) {
    return (
        <div className="welcome-screen">
            <h1>FOOD TIME</h1>
            <p>Kalori alma, Beslen.</p>
            <button className="start-btn" onClick={onStart}>
                SİSTEMİ BAŞLAT
            </button>
        </div>
    );
}

export default WelcomeScreen;
