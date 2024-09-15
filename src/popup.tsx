import React, { useState, ChangeEvent, useEffect } from 'react';
import { createRoot } from "react-dom/client";
import { ChevronDown, Upload, Play } from 'lucide-react';

type HSKLevel = 1 | 2 | 3 | 4 | 5 | 6;

const ChineseLanguageLevelSelector: React.FC = () => {
    const [level, setLevel] = useState<HSKLevel | ''>('');
    const [file, setFile] = useState<File | null>(null);

    const handleLevelChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const newLevel = event.target.value as HSKLevel | '';
        setLevel(newLevel);
        chrome.storage.local.set({ 'level': newLevel }, function() {
            console.log('Level is set to ' + newLevel);
        });
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                chrome.storage.local.set({ 'fileContent': content }, function() {
                    console.log('File content saved to local storage');
                    chrome.runtime.sendMessage({ 
                        type: 'fileUploaded', 
                        content
                    }, (response) => {
                        console.log('File upload response:', response);
                    });
                });
            };
            reader.readAsText(selectedFile);
        }
    };

    const handleStartTranslation = () => {
        console.log('Start translation button clicked');
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            if (currentTab.id) {
                chrome.runtime.sendMessage({ type: "startTranslation" }, (response) => {
                    console.log('Start translation response:', response);
                });
            } else {
                console.error('No active tab found');
            }
        });
    };

    useEffect(() => {
        chrome.storage.local.get(['level'], function(result) {
            if (result['level']) {
                setLevel(result['level'] as HSKLevel);
                console.log('Level value retrieved:', result['level']);
            }
        });
    }, []);

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
            color: '#2c5282',
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
            border: '2px solid #bee3f8',
            borderRadius: '8px',
            backgroundColor: '#f0f9ff',
            appearance: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            color: '#2c5282',
        },
        arrow: {
            position: 'absolute' as const,
            top: '50%',
            right: '15px',
            transform: 'translateY(-50%)',
            pointerEvents: 'none' as const,
            color: '#3182ce',
        },
        message: {
            fontSize: '18px',
            color: '#2b6cb0',
            textAlign: 'center' as const,
            marginTop: '24px',
            fontWeight: 600,
        },
        fileUpload: {
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            marginTop: '20px',
        },
        fileInput: {
            display: 'none',
        },
        button: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: '#3182ce',
            color: '#ffffff',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            border: 'none',
            fontSize: '16px',
            fontWeight: 600,
        },
        buttonText: {
            marginLeft: '10px',
        },
        startButton: {
            marginTop: '20px',
            width: '100%',
            justifyContent: 'center',
            backgroundColor: '#48bb78',
            cursor: 'pointer',
        },
    };
    return (
        <div style={styles.container}>
 <h2 style={styles.title}>Select Your Chinese Language Level</h2>
            <div style={styles.selectContainer}>
                <select
                    value={level}
                    onChange={handleLevelChange}
                    style={{
                        ...styles.select,
                        appearance: 'none',
                    }}
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
            
            <div style={styles.fileUpload}>
                <input
                    type="file"
                    id="fileInput"
                    accept=".txt"
                    onChange={handleFileChange}
                    style={styles.fileInput}
                />
                <label htmlFor="fileInput" style={styles.button}>
                    <Upload size={20} />
                    <span style={styles.buttonText}>
                        {file ? file.name : 'Upload TXT File'}
                    </span>
                </label>
            </div>
            <button 
                onClick={handleStartTranslation} 
                style={{...styles.button, ...styles.startButton}}
            >
                <Play size={20} />
                <span style={styles.buttonText}>Start Translation</span>
            </button>
        </div>
    );
};

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <ChineseLanguageLevelSelector />
    </React.StrictMode>
);