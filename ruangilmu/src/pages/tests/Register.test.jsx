// src/tests/Register.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from "../Register";
import '@testing-library/jest-dom';

const mockSignInWithPopup = jest.fn();

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock Firebase
jest.mock('firebase/compat/app', () => {
    // Buat fungsi tiruan yang akan menjadi firebase.auth()
    const authService = () => ({
        signInWithPopup: mockSignInWithPopup,
    });

    // Tambahkan properti .GoogleAuthProvider ke fungsi tiruan tersebut
    // Ini meniru perilaku firebase.auth.GoogleAuthProvider
    authService.GoogleAuthProvider = class GoogleAuthProvider { };

    // Kembalikan struktur mock yang lengkap
    return {
        __esModule: true,
        default: {
            apps: { length: 1 },
            initializeApp: jest.fn(),
            // Sekarang 'auth' adalah fungsi yang juga memiliki properti
            auth: authService,
        },
    };
});

// jest.mock('firebase/compat/auth', () => ({}));

// Mock Toast component
jest.mock('../../components/jsx/Toast', () => {
    return function MockToast({ message, type, isVisible }) {

        if (!isVisible) {
            return null;
        }

        return (
            <div data-testid="toast" className={`mock-toast-${type}`}>
                {message}
            </div>
        );
    };
});

// Mock images
jest.mock('../../components/img/eye_icon.svg', () => 'eye-icon.svg');
jest.mock('../../components/img/google_logo.svg', () => 'google-logo.svg');
jest.mock('../../components/img/facebook_logo.svg', () => 'facebook-logo.svg');
jest.mock('../../components/img/kid.png', () => 'kid.png');

// Mock fetch
global.fetch = jest.fn();

// Helper function to render component with router
const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('Register Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        fetch.mockClear();
        mockNavigate.mockClear();

        // Clear sessionStorage
        sessionStorage.clear();
        localStorage.clear();
    });

    // Rendering Tests
    describe('Rendering', () => {
        test('renders register page correctly', () => {
            renderWithRouter(<RegisterPage />);

            expect(screen.getByText('SELAMAT DATANG!')).toBeInTheDocument();
            expect(screen.getByText(/Sudah punya akun/)).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Nama lengkap kamu')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('kamu@contoh.com')).toBeInTheDocument();
            expect(screen.getAllByPlaceholderText('6 karakter atau lebih')).toHaveLength(2);
            expect(screen.getByRole('button', { name: 'Daftar' })).toBeInTheDocument();
        });

        test('renders social login buttons', () => {
            renderWithRouter(<RegisterPage />);

            const googleButton = screen.getByRole('button', { name: 'Google' });
            const facebookButton = screen.getByRole('button', { name: 'Facebook' });

            expect(googleButton).toBeInTheDocument();
            expect(facebookButton).toBeInTheDocument();
        });

        test('renders login link', () => {
            renderWithRouter(<RegisterPage />);

            const loginLink = screen.getByRole('link', { name: 'Masuk' });
            expect(loginLink).toBeInTheDocument();
            expect(loginLink).toHaveAttribute('href', '/login');
        });
    });

    // Form Validation Tests
    describe('Form Validation', () => {
        test('submit button is disabled when form is invalid', () => {
            renderWithRouter(<RegisterPage />);

            const submitButton = screen.getByRole('button', { name: 'Daftar' });
            expect(submitButton).toBeDisabled();
        });

        test('submit button is enabled when all fields are valid', async () => {
            renderWithRouter(<RegisterPage />);

            const nameInput = screen.getByPlaceholderText('Nama lengkap kamu');
            const emailInput = screen.getByPlaceholderText('kamu@contoh.com');
            const passwordInputs = screen.getAllByPlaceholderText('6 karakter atau lebih');
            const submitButton = screen.getByRole('button', { name: 'Daftar' });

            await act(async () => {
                fireEvent.change(nameInput, { target: { value: 'John Doe' } });
                fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
                fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
                fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });
            });

            expect(submitButton).toBeEnabled();
        });

        test('shows password validation error for short password', async () => {
            renderWithRouter(<RegisterPage />);

            const passwordInput = screen.getAllByPlaceholderText('6 karakter atau lebih')[0];

            await act(async () => {
                fireEvent.change(passwordInput, { target: { value: '123' } });
            });

            expect(screen.getByText('Kata sandi minimal 6 karakter.')).toBeVisible();
        });

        test('shows password mismatch error', async () => {
            renderWithRouter(<RegisterPage />);

            const passwordInputs = screen.getAllByPlaceholderText('6 karakter atau lebih');

            await act(async () => {
                fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
                fireEvent.change(passwordInputs[1], { target: { value: 'different' } });
            });

            expect(screen.getByText('Kata sandi tidak sesuai.')).toBeVisible();
        });
    });

    // Password Visibility Tests
    describe('Password Visibility', () => {
        test('toggles password visibility', async () => {
            renderWithRouter(<RegisterPage />);

            const passwordInput = screen.getAllByPlaceholderText('6 karakter atau lebih')[0];
            const toggleButtons = screen.getAllByAltText('Toggle Password');

            expect(passwordInput.type).toBe('password');

            await act(async () => {
                fireEvent.click(toggleButtons[0]);
            });

            expect(passwordInput.type).toBe('text');

            await act(async () => {
                fireEvent.click(toggleButtons[0]);
            });

            expect(passwordInput.type).toBe('password');
        });

        test('toggles confirm password visibility', async () => {
            renderWithRouter(<RegisterPage />);

            const confirmPasswordInput = screen.getAllByPlaceholderText('6 karakter atau lebih')[1];
            const toggleButton = screen.getByAltText('Toggle Confirm Password');

            expect(confirmPasswordInput.type).toBe('password');

            await act(async () => {
                fireEvent.click(toggleButton);
            });

            expect(confirmPasswordInput.type).toBe('text');
        });
    });

    // Form Submission Tests
    describe('Form Submission', () => {
        test('handles successful registration', async () => {
            const mockResponse = {
                ok: true,
                json: async () => ({
                    message: 'Registration successful',
                    user: { id: 1, name: 'John Doe' }
                })
            };
            fetch.mockResolvedValueOnce(mockResponse);

            renderWithRouter(<RegisterPage />);

            const nameInput = screen.getByPlaceholderText('Nama lengkap kamu');
            const emailInput = screen.getByPlaceholderText('kamu@contoh.com');
            const passwordInputs = screen.getAllByPlaceholderText('6 karakter atau lebih');
            const submitButton = screen.getByRole('button', { name: 'Daftar' });

            await act(async () => {
                fireEvent.change(nameInput, { target: { value: 'John Doe' } });
                fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
                fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
                fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });
            });

            await act(async () => {
                fireEvent.click(submitButton);
            });

            expect(fetch).toHaveBeenCalledWith('http://ruangilmu.up.railway.app/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nama: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123',
                    confirmPassword: 'password123'
                }),
            });

            await waitFor(() => {
                expect(screen.getByTestId('toast')).toBeInTheDocument();
                expect(screen.getByText('Register berhasil Silahkan periksa email kamu')).toBeInTheDocument();
            });

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/verify');
            }, { timeout: 2000 });
        });

        test('handles registration failure', async () => {
            const mockResponse = {
                ok: false,
                json: async () => ({
                    message: 'Email already exists'
                })
            };
            fetch.mockResolvedValueOnce(mockResponse);

            renderWithRouter(<RegisterPage />);

            const nameInput = screen.getByPlaceholderText('Nama lengkap kamu');
            const emailInput = screen.getByPlaceholderText('kamu@contoh.com');
            const passwordInputs = screen.getAllByPlaceholderText('6 karakter atau lebih');
            const submitButton = screen.getByRole('button', { name: 'Daftar' });

            await act(async () => {
                fireEvent.change(nameInput, { target: { value: 'John Doe' } });
                fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
                fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
                fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });
            });

            await act(async () => {
                fireEvent.click(submitButton);
            });

            await waitFor(() => {
                expect(screen.getByTestId('toast')).toBeInTheDocument();
                expect(screen.getByText('Email already exists')).toBeInTheDocument();
            });
        });

        test('handles network error during registration', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));

            renderWithRouter(<RegisterPage />);

            const nameInput = screen.getByPlaceholderText('Nama lengkap kamu');
            const emailInput = screen.getByPlaceholderText('kamu@contoh.com');
            const passwordInputs = screen.getAllByPlaceholderText('6 karakter atau lebih');
            const submitButton = screen.getByRole('button', { name: 'Daftar' });

            await act(async () => {
                fireEvent.change(nameInput, { target: { value: 'John Doe' } });
                fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
                fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
                fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });
            });

            await act(async () => {
                fireEvent.click(submitButton);
            });

            await waitFor(() => {
                expect(screen.getByTestId('toast')).toBeInTheDocument();
                expect(screen.getByText('Terjadi Kesalahan pada server!')).toBeInTheDocument();
            });
        });
    });

    // Google Sign-in Tests
    describe('Google Sign-in', () => {
        beforeEach(() => {
            // Pastikan untuk membersihkan mock ini setiap sebelum tes
            mockSignInWithPopup.mockClear();
        });
        test('handles successful Google sign-in', async () => {
            // const mockGoogleAuth = {
            //     signInWithPopup: jest.fn().mockResolvedValue({
            //         user: {
            //             getIdToken: jest.fn().mockResolvedValue('mock-id-token'),
            //             email: 'john@example.com',
            //             displayName: 'John Doe'
            //         }
            //     })
            // };

            // const mockFirebase = require('firebase/compat/app').default;
            // mockFirebase.auth = jest.fn(() => mockGoogleAuth);

            mockSignInWithPopup.mockResolvedValue({
                user: {
                    getIdToken: jest.fn().mockResolvedValue('mock-id-token'),
                    email: 'john@example.com',
                    displayName: 'John Doe'
                }
            });

            const mockResponse = {
                ok: true,
                json: async () => ({
                    message: 'Google login successful',
                    data: {
                        auth: {
                            accessToken: 'mock-access-token'
                        }
                    },
                    user: { id: 1, name: 'John Doe' }
                })
            };
            fetch.mockResolvedValueOnce(mockResponse);

            renderWithRouter(<RegisterPage />);

            const googleButton = screen.getByRole('button', { name: 'Google' });

            console.log('--- Debugging Tombol Google Sebelum Klik ---');
            screen.debug(googleButton);

            expect(googleButton).toBeEnabled();

            await act(async () => {
                fireEvent.click(googleButton);
            });

            expect(mockSignInWithPopup).toHaveBeenCalled();

            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith('http://ruangilmu.up.railway.app/auth/oauth-google', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idToken: 'mock-id-token',
                        email: 'john@example.com',
                        displayName: 'John Doe'
                    }),
                });
            });
        });
    });

    // SessionStorage Tests
    describe('SessionStorage Handling', () => {
        test('shows success toast from sessionStorage', () => {
            sessionStorage.setItem('registerStatus', 'success');

            renderWithRouter(<RegisterPage />);

            expect(screen.getByTestId('toast')).toBeInTheDocument();
            expect(screen.getByText('Register berhasil! Silahkan periksa email anda.')).toBeInTheDocument();
            expect(sessionStorage.getItem('registerStatus')).toBeNull();
        });

        test('shows error toast from sessionStorage', () => {
            sessionStorage.setItem('registerStatus', 'error');

            renderWithRouter(<RegisterPage />);

            expect(screen.getByTestId('toast')).toBeInTheDocument();
            expect(screen.getByText('Email telah digunakan!')).toBeInTheDocument();
            expect(sessionStorage.getItem('registerStatus')).toBeNull();
        });
    });

    // Loading States
    describe('Loading States', () => {
        test('shows loading state during form submission', async () => {
            fetch.mockImplementation(() => new Promise(() => { })); // Never resolves

            renderWithRouter(<RegisterPage />);

            const nameInput = screen.getByPlaceholderText('Nama lengkap kamu');
            const emailInput = screen.getByPlaceholderText('kamu@contoh.com');
            const passwordInputs = screen.getAllByPlaceholderText('6 karakter atau lebih');
            const submitButton = screen.getByRole('button', { name: 'Daftar' });

            await act(async () => {
                fireEvent.change(nameInput, { target: { value: 'John Doe' } });
                fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
                fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
                fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });
            });

            await act(async () => {
                fireEvent.click(submitButton);
            });

            expect(screen.getByText('Memproses...')).toBeInTheDocument();
            expect(submitButton).toBeDisabled();
        });
    });
});