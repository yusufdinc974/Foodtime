import { useState } from 'react';
import { mealAPI } from '../services/api';
import './MealHistory.css';

function MealHistory() {
    const [historyVisible, setHistoryVisible] = useState(false);
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const history = await mealAPI.getHistory(10);
            setMeals(history);
            setHistoryVisible(!historyVisible);
        } catch (error) {
            console.error('Error loading history:', error);
            alert('Geçmiş yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
    };

    return (
        <div className="meal-history">
            <div className="history-trigger" onClick={loadHistory}>
                📅 {loading ? 'Yükleniyor...' : '10 Günlük Öğün Geçmişi'}
            </div>

            {historyVisible && (
                <div className="history-content">
                    {meals.length === 0 ? (
                        <p>Henüz geçmiş öğün kaydınız bulunmuyor.</p>
                    ) : (
                        meals.map((meal) => (
                            <div key={meal.id} className="hist-day">
                                <b>{formatDate(meal.meal_date)}:</b><br />
                                Sabah: {meal.morning_meal || '-'} |
                                Öğle: {meal.afternoon_meal || '-'} |
                                Akşam: {meal.evening_meal || '-'}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default MealHistory;
