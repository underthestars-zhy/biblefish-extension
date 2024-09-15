import React, {useState, ChangeEvent, useEffect} from 'react';
import {createRoot} from "react-dom/client";

type HSKLevel = 1 | 2 | 3 | 4 | 5 | 6

const ChineseLanguageLevelSelector: React.FC = () => {
    const [level, setLevel] = useState<HSKLevel | ''>('');

    const handleLevelChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const newLevel = event.target.value as HSKLevel | '';
        setLevel(newLevel);
        chrome.storage.local.set({ 'level': newLevel }, function() {
            console.log('Value is set to ' + newLevel);
        });
    };

    useEffect(() => {
        chrome.storage.local.get('level', function(result) {
            if (result['level']) {
                setLevel(result['level'] as HSKLevel);
                console.log('Value currently is ' + result['level']);
            }
        });
    }, []);
    // Styles
    const styles = {
        container: {
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            width: '300px',
            margin: '20px auto',
            padding: '20px 0',
        },
        title: {
            fontSize: '24px',
            fontWeight: 600,
            color: '#2c3e50',
            marginBottom: '20px',
            textAlign: 'center',
        },
        selectContainer: {
            position: 'relative',
            marginBottom: '25px',
        },
        select: {
            width: '100%',
            padding: '12px 20px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            appearance: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        arrow: {
            position: 'absolute',
            top: '50%',
            right: '15px',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid #555',
            pointerEvents: 'none',
        },
        message: {
            fontSize: '18px',
            color: '#34495e',
            textAlign: 'center',
            marginTop: '20px',
        }
    } as const;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Select Your Chinese Language Level</h2>
            <div style={styles.selectContainer}>
                <select
                    value={level}
                    onChange={handleLevelChange}
                    style={styles.select}
                >
                    <option value="">Choose your level</option>
                    {([1, 2, 3, 4, 5, 6] as const).map((num) => (
                        <option key={num} value={num}>
                            HSK {num}
                        </option>
                    ))}
                </select>
                <div style={styles.arrow}></div>
            </div>
            {level && (
                <p style={styles.message}>Your selected level: {level}</p>
            )}
        </div>
    );
};

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <ChineseLanguageLevelSelector />
    </React.StrictMode>
);
