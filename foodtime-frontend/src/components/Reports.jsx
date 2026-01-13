import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import './Reports.css';

function Reports() {
    const [report, setReport] = useState(null);
    const [weekOffset, setWeekOffset] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWeeklyReport();
    }, [weekOffset]);

    const fetchWeeklyReport = async () => {
        setLoading(true);
        try {
            const data = await api.get(`/reports/weekly?week_offset=${weekOffset}`);
            setReport(data);
        } catch (error) {
            console.error('Failed to fetch weekly report:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    };

    const formatWeekRange = () => {
        if (!report) return '';
        const start = new Date(report.week_start);
        const end = new Date(report.week_end);
        return `${start.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} - ${end.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    };

    const getTrendIcon = (trend) => {
        if (trend === 'improving' || trend === 'decreasing') return '↑';
        if (trend === 'declining' || trend === 'increasing') return '↓';
        return '→';
    };

    const getTrendColor = (trend) => {
        if (trend === 'improving') return 'trend-up';
        if (trend === 'declining') return 'trend-down';
        return 'trend-stable';
    };

    if (loading) {
        return <div className="reports-loading">Haftalık rapor yükleniyor...</div>;
    }

    if (!report) {
        return <div className="reports-error">Rapor yüklenemedi.</div>;
    }

    const chartData = report.daily_breakdown.map(day => ({
        date: formatDate(day.date),
        score: day.health_score,
        meals: day.meal_count
    }));

    return (
        <div className="reports">
            {/* Week Selector */}
            <div className="week-selector">
                <button onClick={() => setWeekOffset(weekOffset - 1)} className="week-nav-btn">
                    ← Önceki Hafta
                </button>
                <div className="week-display">
                    <span className="week-label">{weekOffset === 0 ? 'Bu Hafta' : `${-weekOffset} Hafta Önce`}</span>
                    <span className="week-range">{formatWeekRange()}</span>
                </div>
                <button
                    onClick={() => setWeekOffset(weekOffset + 1)}
                    className="week-nav-btn"
                    disabled={weekOffset >= 0}
                >
                    Sonraki Hafta →
                </button>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">
                <div className="summary-card">
                    <div className="card-icon">●</div>
                    <div className="card-content">
                        <div className="card-label">Ortalama Skor</div>
                        <div className="card-value">
                            {report.summary.avg_health_score}
                            <span className="card-suffix">/10</span>
                        </div>
                        <div className={`card-trend ${getTrendColor(report.trends.health_score_trend)}`}>
                            {getTrendIcon(report.trends.health_score_trend)} {report.trends.health_score_trend === 'improving' ? 'Gelişiyor' : report.trends.health_score_trend === 'declining' ? 'Düşüyor' : 'Stabil'}
                        </div>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="card-icon">▲</div>
                    <div className="card-content">
                        <div className="card-label">Toplam Öğün</div>
                        <div className="card-value">{report.summary.total_meals}</div>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="card-icon">■</div>
                    <div className="card-content">
                        <div className="card-label">Ort. Kalori/Gün</div>
                        <div className="card-value">
                            {Math.round(report.summary.avg_calories_per_day)}
                            <span className="card-suffix">kcal</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Breakdown Chart */}
            <div className="chart-section">
                <h3 className="section-title">Günlük Sağlık Skoru Dağılımı</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                        <Bar dataKey="score" fill="#FFED00" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* AI Insights */}
            <div className="insights-section">
                <h3 className="section-title">Haftalık Değerlendirme</h3>
                <div className="insights-content">
                    {report.insights.split('\n').map((paragraph, index) => (
                        paragraph.trim() && <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Reports;
