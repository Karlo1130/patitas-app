import React from 'react';
function Alert({ alert, type }) {
    if (!alert) return null;
    return (
        <div className={`alert alert-${type}`} role="alert" style={{ position: 'fixed', top: 0, margin: '20px' }}>
            {alert}
        </div>
    );
}



export default Alert;
