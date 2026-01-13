import './ResultPanel.css';

function ResultPanel({ title, result }) {
    return (
        <div className="right-side">
            <div className="res-title">{title}</div>
            <div
                className="result-content"
                dangerouslySetInnerHTML={{ __html: result }}
            />
            <div className="disclaimer">
                ⚠️ Uyarı: Analizler yapay zeka tarafından sağlanır; kesinlik içermez ve tıbbi tavsiye yerine geçmez.
            </div>
        </div>
    );
}

export default ResultPanel;
