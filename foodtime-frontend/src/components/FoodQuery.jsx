import { useState } from 'react';
import { analysisAPI } from '../services/api';
import './FoodQuery.css';

function FoodQuery({ onResult }) {
    const [foodDescription, setFoodDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleQuery = async () => {
        if (!foodDescription.trim()) {
            alert('Lütfen bir besin girişi yapın.');
            return;
        }

        setLoading(true);
        onResult('Sorgulanıyor...');

        try {
            const response = await analysisAPI.analyzeFood(foodDescription);
            onResult(response.analysis_result.replace(/\n/g, '<br>'));
        } catch (error) {
            console.error('Query error:', error);
            onResult('Hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="food-query">
            <div className="card">
                <label>Yemek veya İçerik</label>
                <textarea
                    rows="6"
                    value={foodDescription}
                    onChange={(e) => setFoodDescription(e.target.value)}
                    placeholder="Örn: Izgara tavuk göğsü, salata, zeytinyağı..."
                />
            </div>
            <button
                className="main-btn"
                onClick={handleQuery}
                disabled={loading}
            >
                {loading ? 'SORGULANIY OR...' : 'SORGULA'}
            </button>
        </div>
    );
}

export default FoodQuery;
