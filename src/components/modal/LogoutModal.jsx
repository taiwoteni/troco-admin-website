'use client'
import React from 'react';

const LogoutModal = ({ onClose, onConfirm, isLoading }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Confirm Logout</h2>
                <p className="mb-4">Are you sure you want to log out?</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z"></path>
                                </svg>
                                Logging out...
                            </div>
                        ) : (
                            'Logout'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
