import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import './ProfileModal.css';

function ProfileModal({ isOpen, onClose }) {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        weight: '',
        height: '',
        gender: 'Erkek',
        job: '',
        goal: 'Kilo Ver'
    });

    // Nutrition targets
    const [calorieTarget, setCalorieTarget] = useState(user?.daily_calorie_target || 2000);
    const [proteinTarget, setProteinTarget] = useState(user?.daily_protein_target || 150);
    const [carbsTarget, setCarbsTarget] = useState(user?.daily_carbs_target || 250);
    const [fatTarget, setFatTarget] = useState(user?.daily_fat_target || 70);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                weight: user.weight || '',
                height: user.height || '',
                gender: user.gender || 'Erkek',
                job: user.job || '',
                goal: user.goal || 'Kilo Ver'
            });
            setCalorieTarget(user.daily_calorie_target || 2000);
            setProteinTarget(user.daily_protein_target || 150);
            setCarbsTarget(user.daily_carbs_target || 250);
            setFatTarget(user.daily_fat_target || 70);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userData = {
                name: formData.name,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                height: formData.height ? parseFloat(formData.height) : null,
                gender: formData.gender,
                job: formData.job || null,
                goal: formData.goal,
                daily_calorie_target: parseInt(calorieTarget),
                daily_protein_target: parseInt(proteinTarget),
                daily_carbs_target: parseInt(carbsTarget),
                daily_fat_target: parseInt(fatTarget)
            };

            // Update existing user (user already exists from signup)
            await userAPI.update(userData);
            updateUser(userData);
            onClose();
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Profil kaydedilemedi. Lütfen tekrar deneyin.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="profile-modal" onClick={onClose}>
            <div className="profile-card" onClick={(e) => e.stopPropagation()}>
                <span className="close-profile" onClick={onClose}>✕</span>
                <h3>PROFİL AYARLARI</h3>

                <form onSubmit={handleSubmit}>
                    <label>Ad Soyad</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <div className="form-row">
                        <input
                            type="number"
                            placeholder="Kilo (kg)"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            step="0.1"
                        />
                        <input
                            type="number"
                            placeholder="Boy (cm)"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                            step="0.1"
                        />
                    </div>

                    <div className="form-row">
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                            <option value="Erkek">Erkek</option>
                            <option value="Kadın">Kadın</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Meslek"
                            value={formData.job}
                            onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                        />
                    </div>

                    <label>Hedef</label>
                    <select
                        value={formData.goal}
                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    >
                        <option value="Kilo Ver">Kilo Ver</option>
                        <option value="Kilo Al">Kilo Al</option>
                        <option value="Kilo Koru">Kilo Koru</option>
                        <option value="Kas Yap">Kas Yap</option>
                    </select>

                    <div className="section-divider"></div>
                    <h4 className="section-title">Günlük Besin Hedefleri</h4>

                    <label>
                        Kalori Hedefi
                        <input
                            type="number"
                            value={calorieTarget}
                            onChange={(e) => setCalorieTarget(e.target.value)}
                            placeholder="2000"
                        />
                        <span className="input-hint">kcal/gün</span>
                    </label>

                    <label>
                        Protein Hedefi
                        <input
                            type="number"
                            value={proteinTarget}
                            onChange={(e) => setProteinTarget(e.target.value)}
                            placeholder="150"
                        />
                        <span className="input-hint">gram/gün</span>
                    </label>

                    <label>
                        Karbonhidrat Hedefi
                        <input
                            type="number"
                            value={carbsTarget}
                            onChange={(e) => setCarbsTarget(e.target.value)}
                            placeholder="250"
                        />
                        <span className="input-hint">gram/gün</span>
                    </label>

                    <label>
                        Yağ Hedefi
                        <input
                            type="number"
                            value={fatTarget}
                            onChange={(e) => setFatTarget(e.target.value)}
                            placeholder="70"
                        />
                        <span className="input-hint">gram/gün</span>
                    </label>

                    <button type="submit" className="main-btn">GÜNCELLE</button>
                </form>
            </div>
        </div>
    );
}

export default ProfileModal;
