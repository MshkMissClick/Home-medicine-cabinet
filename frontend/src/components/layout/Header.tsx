import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from '../auth/LoginForm';
import { RegisterForm } from '../auth/RegisterForm';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <header className="bg-white shadow-lg border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Логотип и навигация */}
                        <div className="flex items-center space-x-12">
                            <h1 className="text-3xl font-bold text-blue-600">MedCabinet</h1>
                            <nav className="hidden md:flex space-x-8">
                                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Features</a>
                                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
                                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Testimonials</a>
                                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
                            </nav>
                        </div>

                        {/* Кнопки авторизации */}
                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <>
                                    <span className="text-gray-700 font-medium">Hello, {user?.name}</span>
                                    <Button
                                        variant="secondary"
                                        onClick={handleLogout}
                                        className="bg-gray-600 hover:bg-gray-700"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="secondary"
                                        onClick={() => setShowLogin(true)}
                                        className="border border-blue-600 text-blue-600 hover:bg-blue-50"
                                    >
                                        Log in
                                    </Button>
                                    <Button
                                        onClick={() => setShowRegister(true)}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Sign up
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Модальные окна */}
            {showLogin && (
                <Modal onClose={() => setShowLogin(false)}>
                    <LoginForm
                        onSwitchToRegister={() => {
                            setShowLogin(false);
                            setShowRegister(true);
                        }}
                        onClose={() => setShowLogin(false)}
                    />
                </Modal>
            )}

            {showRegister && (
                <Modal onClose={() => setShowRegister(false)}>
                    <RegisterForm
                        onSwitchToLogin={() => {
                            setShowRegister(false);
                            setShowLogin(true);
                        }}
                        onClose={() => setShowRegister(false)}
                    />
                </Modal>
            )}
        </>
    );
};