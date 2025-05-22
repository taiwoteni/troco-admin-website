'use client'
import React from 'react';

const BlockedModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4 text-red-600">Account Blocked</h2>
                <p className="mb-4">This admin account has been blocked by the super admin. Please contact the super admin to resolve the issue.</p>
                <button
                    onClick={onClose}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 transition-colors duration-200"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default BlockedModal;
