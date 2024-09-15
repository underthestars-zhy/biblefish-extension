import React, { useState, ChangeEvent, useEffect } from 'react';
import { createRoot } from "react-dom/client";
import { ChevronDown } from 'lucide-react'; // Import ChevronDown icon from the 'lucide-react' library

// Define a custom type for the HSK levels (1-6)
type HSKLevel = 1 | 2 | 3 | 4 | 5 | 6;

const ChineseLanguageLevelSelector: React.FC = () => {
    // Declare a state variable 'level' with initial value '' (no selection)
    // useState is used to handle the current selected HSK level.
    const [level, setLevel] = useState<HSKLevel | ''>('');

    // This function handles changes when the user selects a different level from the dropdown.
    const handleLevelChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const newLevel = event.target.value as HSKLevel | ''; // Type cast the selected value to HSKLevel or ''.
        setLevel(newLevel); // Update the state with the new level
        // Store the new level in Chrome's local storage
        chrome.storage.local.set({ 'level': newLevel }, function() {
            console.log('Value is set to ' + newLevel); // Log the updated value
        });
    };

    // useEffect hook to fetch the previously selected level from Chrome's local storage when the component loads.
    useEffect(() => {
        chrome.storage.local.get('level', function(result) {
            if (result['level']) { // If a stored value is found
                setLevel(result['level'] as HSKLevel); // Set the state with the stored value
                console.log('Value currently is ' + result['level']); // Log the value
            }
        });
    }, []); // Empty dependency array ensures this effect runs only once when the component mounts.

    // Define inline styles for the component with a light blue accent
    const styles = {
        container: {
            fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Font settings
            width: '320px',
            margin: '30px auto',
            padding: '30px',
            backgroundColor: '#ffffff', // White background
            borderRadius: '12px', // Rounded corners
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', // Subtle shadow for 3D effect
            border: '1px solid #e6f2ff', // Light blue border
        },
        title: {
            fontSize: '24px', // Title font size
            fontWeight: 700, // Bold text
            color: '#2c5282', // Darker blue color for the title
            marginBottom: '24px',
            textAlign: 'center' as const, // Center-align the title
        },
        selectContainer: {
            position: 'relative' as const, // Relative position to place the arrow correctly
            marginBottom: '28px',
        },
        select: {
            width: '100%', // Full width of the container
            padding: '14px 20px', // Padding for better spacing
            fontSize: '16px',
            border: '2px solid #bee3f8', // Light blue border
            borderRadius: '8px', // Rounded select box
            backgroundColor: '#f0f9ff', // Very light blue background for a clean look
            '-webkit-appearance': 'none', // Remove default appearance (compatibility for webkit browsers)
            '-moz-appearance': 'none', // Remove default appearance (for Mozilla)
            cursor: 'pointer', // Pointer cursor when hovering over the select
            transition: 'all 0.3s ease', // Smooth transition for hover effects
            color: '#2c5282', // Darker blue text color
        },
        arrow: {
            position: 'absolute' as const, // Absolute positioning for the arrow within the select container
            top: '50%', // Vertically center the arrow
            right: '15px', // Place arrow to the right
            transform: 'translateY(-50%)', // Vertically center the arrow icon
            pointerEvents: 'none' as const, // Disable pointer events on the arrow icon
            color: '#3182ce', // Blue color for the arrow icon
        },
        message: {
            fontSize: '18px', // Font size for the message
            color: '#2b6cb0', // Slightly darker blue color for the message text
            textAlign: 'center' as const, // Center-align the message
            marginTop: '24px',
            fontWeight: 600, // Semi-bold for the message
        }
    };

    return (
        <div style={styles.container}>
            {/* Title for the dropdown */}
            <h2 style={styles.title}>Select Your Chinese Language Level</h2>
            {/* Container for the select box */}
            <div style={styles.selectContainer}>
                <select
                    value={level} // Set the select value to the current state
                    onChange={handleLevelChange} // Call handleLevelChange when selection changes
                    style={styles.select} // Apply custom styles
                >
                    <option value="">Choose your level</option> {/* Default option */}
                    {/* Map over the HSK levels and render each option */}
                    {([1, 2, 3, 4, 5, 6] as const).map((num) => (
                        <option key={num} value={num}>
                            HSK {num}
                        </option>
                    ))}
                </select>
                {/* Display the ChevronDown icon in the dropdown */}
                <ChevronDown style={styles.arrow} size={20} />
            </div>
            {/* Conditionally render a message showing the selected level if it's chosen */}
            {level && (
                <p style={styles.message}>Your selected level: HSK {level}</p>
            )}
        </div>
    );
};

// Render the component to the root element in the HTML
const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <ChineseLanguageLevelSelector /> {/* Render the ChineseLanguageLevelSelector component */}
    </React.StrictMode>
);
