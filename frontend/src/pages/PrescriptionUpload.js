import React from 'react';

const PrescriptionUpload = () => {
  return (
    <div style={{
      background: '#c7f2ff',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px'
    }}>
      <div style={{
        backgroundColor: '#e5faff',
        borderRadius: '16px',
        padding: '30px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/463/463574.png" 
          alt="Prescription Icon"
          style={{ width: '80px', marginBottom: '20px' }}
        />
        <h2 style={{ marginBottom: '20px' }}>Add Prescription</h2>

        <button style={{
          width: '100%',
          padding: '10px',
          borderRadius: '10px',
          border: 'none',
          backgroundColor: '#b2e0e9',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '25px'
        }}>
          Upload Prescription
        </button>

        <label style={{ fontWeight: 'bold', display: 'block', textAlign: 'left' }}>Set Reminder</label>
        <input
          type="datetime-local"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            marginBottom: '20px',
            marginTop: '5px'
          }}
        />

        <label style={{ fontWeight: 'bold', display: 'block', textAlign: 'left' }}>Notes:</label>
        <textarea
          placeholder="Medicine Name..."
          rows={4}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            marginBottom: '20px',
            marginTop: '5px'
          }}
        />

        <button style={{
          width: '100%',
          padding: '10px',
          borderRadius: '10px',
          border: 'none',
          backgroundColor: '#a4d8e1',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          Save Reminder
        </button>
      </div>
    </div>
  );
};

export default PrescriptionUpload;
