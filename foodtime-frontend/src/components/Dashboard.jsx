import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import StatCard from './StatCard';
import NutritionProgress from './NutritionProgress';
import RecentMealCard from './RecentMealCard';
import './Dashboard.css';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const data = await api.get('/dashboard/stats');
            setStats(data);
            setError(null);
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            setError(error.message || 'Dashboard yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="dashboard-loading">Dashboard yükleniyor...</div>;
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <p>❌ {error}</p>
                <button onClick={fetchDashboardStats} className="retry-btn">Tekrar Dene</button>
            </div>
        );
    }

    if (!stats) {
        return <div className="dashboard-error">Veri bulunamadı.</div>;
    }

    // Format date for chart
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    };

    const chartData = stats.week_trend.map(day => ({
        date: formatDate(day.date),
        score: day.score
    }));

    return (
        <div className="dashboard">
            {/* Stats Cards */}
            <div className="stats-grid">
                <StatCard
                    title="Bugünkü Skor"
                    value={stats.today.health_score}
                    suffix="/10"
                    icon="●"
                    color="yellow"
                />
                <StatCard
                    title="Hafta Ortalaması"
                    value={stats.summary.week_avg}
                    suffix="/10"
                    icon="▲"
                    color="blue"
                />
                <StatCard
                    title="Seri"
                    value={stats.summary.streak_days}
                    suffix=" gün"
                    icon="■"
                    color="orange"
                />
            </div>

            {/* Nutrition Progress */}
            <NutritionProgress />

            {/* Health Score Trend Chart */}
            <div className="chart-container">
                <h3 className="chart-title">7 Günlük Sağlık Skoru Trendi</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 237, 0, 0.1)" />
                        <XAxis
                            dataKey="date"
                            stroke="#E8E8E8"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            domain={[0, 10]}
                            stroke="#E8E8E8"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0, 28, 84, 0.9)',
                                border: '2px solid #FFED00',
                                borderRadius: '10px'
                            }}
                            labelStyle={{ color: '#FFED00' }}
                            itemStyle={{ color: '#E8E8E8' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#FFED00"
                            strokeWidth={3}
                            dot={{ fill: '#FFED00', r: 5 }}
                            activeDot={{ r: 7 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Recent Meals */}
            <div className="recent-meals-section">
                <h3 className="section-title">Son Öğünler</h3>
                <div className="recent-meals-grid">
                    {stats.recent_meals.length > 0 ? (
                        stats.recent_meals.slice(0, 3).map(meal => (
                            <RecentMealCard key={meal.id} meal={meal} />
                        ))
                    ) : (
                        <p className="no-meals">Henüz öğün kaydı yok. Hemen bir öğün kaydet!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
