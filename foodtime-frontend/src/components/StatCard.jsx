import { useEffect, useState } from 'react';
import './StatCard.css';

function StatCard({ title, value, suffix = '', icon, color = 'yellow' }) {
    const [displayValue, setDisplayValue] = useState(0);

    // Animated counter effect
    useEffect(() => {
        const duration = 1000; // 1 second
        const steps = 50;
        const increment = value / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            if (currentStep >= steps) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(prev => Math.min(prev + increment, value));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <div className={`stat-card stat-card-${color}`}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-content">
                <div className="stat-title">{title}</div>
                <div className="stat-value">
                    {displayValue.toFixed(1)}{suffix}
                </div>
            </div>
        </div>
    );
}

export default StatCard;
