import { useState } from 'react';
import { analysisAPI } from '../services/api';
import './PhotoAnalysis.css';

function PhotoAnalysis({ onResult }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) {
            alert('Lütfen bir fotoğraf seçin.');
            return;
        }

        setLoading(true);
        onResult('Fotoğraf analiz ediliyor...');

        try {
            // Convert file to base64
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
                const mimeType = selectedFile.type;

                try {
                    const response = await analysisAPI.analyzePhoto(base64, mimeType);
                    onResult(response.analysis_result.replace(/\n/g, '<br>'));
                } catch (error) {
                    console.error('Analysis error:', error);
                    onResult('Hata oluştu. Lütfen tekrar deneyin.');
                } finally {
                    setLoading(false);
                }
            };
            reader.onerror = () => {
                onResult('Dosya okuma hatası.');
                setLoading(false);
            };
            reader.readAsDataURL(selectedFile);
        } catch (error) {
            console.error('File reading error:', error);
            onResult('Hata oluştu. Lütfen tekrar deneyin.');
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSelectedFile(null);
        setPreview(null);
    };

    return (
        <div className="photo-analysis">
            <div className="upload-area">
                <input
                    type="file"
                    id="photo-input"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />

                {!preview ? (
                    <label htmlFor="photo-input" className="upload-label">
                        <div className="upload-icon">📸</div>
                        <p>Fotoğraf Yükle</p>
                        <span className="upload-hint">Besin fotoğrafı seçin</span>
                    </label>
                ) : (
                    <div className="preview-container">
                        <img src={preview} alt="Preview" className="preview-image" />
                        <button onClick={handleClear} className="clear-btn">✕</button>
                    </div>
                )}
            </div>

            {selectedFile && (
                <button
                    className="main-btn"
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    {loading ? 'ANALİZ EDİLİYOR...' : 'FOTOĞRAFI ANALİZ ET'}
                </button>
            )}
        </div>
    );
}

export default PhotoAnalysis;
