import React, { useState, ChangeEvent, useEffect } from 'react';
import { createRoot } from "react-dom/client";
import { ChevronDown } from 'lucide-react';

type HSKLevel = 1 | 2 | 3 | 4 | 5 | 6;

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

    // Updated styles with light blue accent
    const styles = {
        container: {
            fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            width: '320px',
            margin: '30px auto',
            padding: '30px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e6f2ff',
        },
        title: {
            fontSize: '24px',
            fontWeight: 700,
            color: '#2c5282', // Darker blue for the title
            marginBottom: '24px',
            textAlign: 'center' as const,
        },
        selectContainer: {
            position: 'relative' as const,
            marginBottom: '28px',
        },
        select: {
            width: '100%',
            padding: '14px 20px',
            fontSize: '16px',
            border: '2px solid #bee3f8', // Light blue border
            borderRadius: '8px',
            backgroundColor: '#f0f9ff', // Very light blue background
            '-webkit-appearance': 'none', // Updated for compatibility
            '-moz-appearance': 'none', // Updated for compatibility
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            color: '#2c5282', // Darker blue text
        },
        arrow: {
            position: 'absolute' as const,
            top: '50%',
            right: '15px',
            transform: 'translateY(-50%)',
            pointerEvents: 'none' as const,
            color: '#3182ce', // Blue arrow color
        },
        message: {
            fontSize: '18px',
            color: '#2b6cb0', // Slightly darker blue for the message
            textAlign: 'center' as const,
            marginTop: '24px',
            fontWeight: 600,
        }
    };

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
                <ChevronDown style={styles.arrow} size={20} />
            </div>
            {level && (
                <p style={styles.message}>Your selected level: HSK {level}</p>
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