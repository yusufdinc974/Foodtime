import { useState } from 'react';
import { analysisAPI } from '../services/api';
import MealHistory from './MealHistory';
import './DailyAnalysis.css';

function DailyAnalysis({ onResult }) {
    const [formData, setFormData] = useState({
        morning_meal: '',
        morning_feeling: '',
        afternoon_meal: '',
        afternoon_feeling: '',
        evening_meal: '',
        evening_feeling: ''
    });
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!formData.morning_meal || !formData.afternoon_meal || !formData.evening_meal) {
            alert('Lütfen tüm öğün bilgilerini doldurun.');
            return;
        }

        setLoading(true);
        onResult('Analiz ediliyor...');

        try {
            // No user_id needed - backend gets it from auth token
            const response = await analysisAPI.analyzeDaily(formData);
            onResult(response.analysis_result.replace(/\n/g, '<br>'));
        } catch (error) {
            console.error('Analysis error:', error);
            onResult('Hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="daily-analysis">
            <div className="card">
                <label>SABAH</label>
                <textarea
                    rows="2"
                    value={formData.morning_meal}
                    onChange={(e) => setFormData({ ...formData, morning_meal: e.target.value })}
                    placeholder="Sabah neler yediniz?"
                />
                <input
                    type="text"
                    placeholder="Hissin..."
                    value={formData.morning_feeling}
                    onChange={(e) => setFormData({ ...formData, morning_feeling: e.target.value })}
                    list="hisler"
                />
            </div>

            <div className="card">
                <label>ÖĞLE</label>
                <textarea
                    rows="2"
                    value={formData.afternoon_meal}
                    onChange={(e) => setFormData({ ...formData, afternoon_meal: e.target.value })}
                    placeholder="Öğlen neler yediniz?"
                />
                <input
                    type="text"
                    placeholder="Hissin..."
                    value={formData.afternoon_feeling}
                    onChange={(e) => setFormData({ ...formData, afternoon_feeling: e.target.value })}
                    list="hisler"
                />
            </div>

            <div className="card">
                <label>AKŞAM</label>
                <textarea
                    rows="2"
                    value={formData.evening_meal}
                    onChange={(e) => setFormData({ ...formData, evening_meal: e.target.value })}
                    placeholder="Akşam neler yediniz?"
                />
                <input
                    type="text"
                    placeholder="Hissin..."
                    value={formData.evening_feeling}
                    onChange={(e) => setFormData({ ...formData, evening_feeling: e.target.value })}
                    list="hisler"
                />
            </div>

            <button
                className="main-btn"
                onClick={handleAnalyze}
                disabled={loading}
            >
                {loading ? 'ANALİZ EDİLİYOR...' : 'ANALİZ ET VE RAPORLA'}
            </button>

            <MealHistory />

            <datalist id="hisler">
                <option value="Enerjik" />
                <option value="Şişkin" />
                <option value="Yorgun" />
                <option value="Mutlu" />
            </datalist>
        </div>
    );
}

export default DailyAnalysis;
