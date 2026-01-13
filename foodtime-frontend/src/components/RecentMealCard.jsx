import './RecentMealCard.css';

function RecentMealCard({ meal }) {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const getScoreColor = (score) => {
        if (!score) return 'poor';
        if (score >= 8) return 'excellent';
        if (score >= 6) return 'good';
        if (score >= 4) return 'average';
        return 'poor';
    };

    const score = meal.health_score || 0;

    return (
        <div className="recent-meal-card">
            <div className="meal-date">{formatDate(meal.date)}</div>
            <div className="meal-description">{meal.description}</div>
            <div className={`meal-score score-${getScoreColor(score)}`}>
                <span className="score-label">Skor:</span>
                <span className="score-value">{score.toFixed(1)}/10</span>
            </div>
        </div>
    );
}

export default RecentMealCard;
