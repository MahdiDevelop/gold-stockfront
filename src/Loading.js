import React from 'react';
import { PulseLoader } from 'react-spinners'; // import the spinner

export default function Loading({ loading }) {
    const styles = {
        spinnerContainer: {
            display: `${loading ? 'flex' : 'none'}`,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            textAlign: 'center',
            zIndex: 1000,
            // backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: semi-transparent background
        },
    };

    return (
        <div style={styles.spinnerContainer} >
            <PulseLoader  size={20} color={"#0dcaf0"} loading={loading} />
        </div>
    );
}
