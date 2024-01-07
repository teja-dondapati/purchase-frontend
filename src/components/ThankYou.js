import React from 'react';

const Thankyou = () => {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '50vh'
    };

    return (
        <div style={containerStyle}>
            Thank you for your order! We sent an email with order details.
        </div>
    );
};

export default Thankyou;