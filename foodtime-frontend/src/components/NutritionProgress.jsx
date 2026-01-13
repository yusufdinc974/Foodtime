import { useEffect, useState } from 'react';
import { api } from '../services/api';
import './NutritionProgress.css';

function NutritionProgress() {
    const [nutrition, setNutrition] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNutrition();
    }, []);

    const fetchNutrition = async () => {
        try {
            const data = await api.get('/nutrition/daily');
            setNutrition(data);
        } catch (error) {
            console.error('Failed to fetch nutrition:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="nutrition-loading">Besin değerleri yükleniyor...</div>;
    }

    if (!nutrition) {
        return null;
    }

    const getProgressColor = (percentage) => {
        if (percentage >= 100) return 'over';
        if (percentage >= 80) return 'good';
        if (percentage >= 50) return 'medium';
        return 'low';
    };

    const renderProgressBar = (label, consumed, target, unit, type) => {
        const percentage = nutrition.percentages[type];
        const color = getProgressColor(percentage);

        return (
            <div className="nutrition-item" key={type}>
                <div className="nutrition-label">
                    <span className="label-name">{label}</span>
                    <span className="label-values">
                        {consumed} / {target} {unit}
                    </span>
                </div>
                <div className="progress-bar-container">
                    <div
                        className={`progress-bar progress-${color}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    >
                        <span className="progress-text">{percentage}%</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="nutrition-progress">
            <h3 className="nutrition-title">Günlük Besin Değerleri</h3>
            <div className="nutrition-grid">
                {renderProgressBar(
                    'Kalori',
                    nutrition.consumed.calories,
                    nutrition.targets.calories,
                    'kcal',
                    'calories'
                )}
                {renderProgressBar(
                    'Protein',
                    nutrition.consumed.protein,
                    nutrition.targets.protein,
                    'g',
                    'protein'
                )}
                {renderProgressBar(
                    'Karbonhidrat',
                    nutrition.consumed.carbs,
                    nutrition.targets.carbs,
                    'g',
                    'carbs'
                )}
                {renderProgressBar(
                    'Yağ',
                    nutrition.consumed.fat,
                    nutrition.targets.fat,
                    'g',
                    'fat'
                )}
            </div>
        </div>
    );
}

export default NutritionProgress;
