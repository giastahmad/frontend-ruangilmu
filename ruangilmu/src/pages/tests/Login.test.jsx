import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom'
import Login from "../Login";

const mockSignInWithPopup = jest.fn();

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock Firebase
jest.mock('firebase/compat/app', () => {
    const authService = () => ({
        signInWithPopup: mockSignInWithPopup,
    });

    authService.GoogleAuthProvider = class GoogleAuthProvider { };

    return {
        __esModule: true,
        default: {
            apps: { length: 1 },
            initializeApp: jest.fn(),
            auth: authService,
        },
    };
});

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

describe('Login Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        fetch.mockClear();
        mockNavigate.mockClear();
        sessionStorage.clear();
        localStorage.clear();
    });

    // test rendering component
    describe('Rendering', () => {
        test('renders login form correctly', () => {
            renderWithRouter(<Login />);

            expect(screen.getByText('SELAMAT DATANG KEMBALI!')).toBeInTheDocument();
            expect(screen.getByText('Belum punya akun?')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('kamu@contoh.com')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('6 karakter atau lebih')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument();

        });

        test('renders Google and Facebook button', () => {
            renderWithRouter(<Login />);

            const googleButton = screen.getByRole('button', { name: 'Google' });
            const facebookButton = screen.getByRole('button', { name: 'Facebook' });

            expect(googleButton).toBeInTheDocument();
            expect(facebookButton).toBeInTheDocument();
        });

        test('renders register link', () => {
            renderWithRouter(<Login />);

            const registerLink = screen.getByRole('link', { name: 'Daftar' });
            expect(registerLink).toBeInTheDocument();
            expect(registerLink).toHaveAttribute('href', '/register');
        });
    });

    // Test form validation
    describe('Form Validation', () => {
        test('submit button is disabled initially', () => {
            renderWithRouter(<Login />);

            const submitButton = screen.getByRole('button', { name: 'Masuk' });
            expect(submitButton).toBeDisabled();
        });

        test('submit button is enabled when form is valid', async () => {
            renderWithRouter(<Login />);

            const emailInput = screen.getByPlaceholderText('kamu@contoh.com');
            const passwordInput = screen.getByPlaceholderText('6 karakter atau lebih');
            const submitButton = screen.getByRole('button', { name: 'Masuk' });

            await act(async () => {
                fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
                fireEvent.change(passwordInput, { target: { value: 'password123' } });
            });

            expect(submitButton).toBeEnabled();
        });

        test('shows password validation error for short passwords', async () => {
            renderWithRouter(<Login />);

            const passwordInput = screen.getByPlaceholderText('6 karakter atau lebih');

            await act(async () => {
                fireEvent.change(passwordInput, { target: { value: '123' } });
            });

            expect(screen.getByText('Kata sandi minimal 6 karakter.')).toBeVisible();
        });
    });

    // Test password visibility toggle
    describe('Password Visibility', () => {
        test('toggles password visibility', async () => {
            renderWithRouter(<Login />);

            const passwordInput = screen.getByPlaceholderText('6 karakter atau lebih');
            const toggleButton = screen.getByAltText('Toggle Password');

            expect(passwordInput).toHaveAttribute('type', 'password');

            await act(async () => {
                fireEvent.click(toggleButton);
            });
            expect(passwordInput).toHaveAttribute('type', 'text');

            await act(async () => {
                fireEvent.click(toggleButton);
            });
            expect(passwordInput).toHaveAttribute('type', 'password');
        });
    });

    // Test form submission
    describe('Form Submission', () => {
        test('handles successful login and navigates to home', async () => {
            // 1. Persiapan Data Mock untuk API Sukses
            const mockApiResponse = {
                status: "success",
                code: 200,
                message: "Login berhasil",
                data: {
                    user: {
                        id: 10,
                        nama: "example-name",
                        email: "example@gmail.com",
                        createdAt: "createdDate"
                    },
                    auth: {
                        accessToken: "example-accessToken",
                    }
                }
            };

            // 2. Mock Implementasi Fetch yang BENAR
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockApiResponse),
            });

            renderWithRouter(<Login />);

            // 3. Aksi Pengguna
            fireEvent.change(screen.getByPlaceholderText('kamu@contoh.com'), { target: { value: 'example@gmail.com' } });
            fireEvent.change(screen.getByPlaceholderText('6 karakter atau lebih'), { target: { value: 'Password123' } });

            await act(async () => {
                fireEvent.click(screen.getByRole('button', { name: 'Masuk' }));
            });

            // 4. Verifikasi Hasil Akhir
            // Tunggu navigasi dipanggil setelah timeout
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/');
            }, { timeout: 2000 }); // Timeout harus lebih besar dari setTimeout di komponen (1500ms)

            // Pastikan localStorage juga sudah diatur dengan benar
            expect(localStorage.getItem('accessToken')).toBe('example-accessToken');
            expect(localStorage.getItem('user')).toBe(JSON.stringify(mockApiResponse.data.user));
        });

        test('handles login failure', async () => {
            const mockApiResponse = {
                status: "fail",
                code: 401,
                message: "Login gagal, periksa kembali data yang Anda masukkan.",
                errors: [{ field: "password", message: "Password yang anda masukkan salah" }]
            };

            fetch.mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve(mockApiResponse),
            });

            renderWithRouter(<Login />);

            // Mengisi form
            fireEvent.change(screen.getByPlaceholderText('kamu@contoh.com'), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByPlaceholderText('6 karakter atau lebih'), { target: { value: 'wrongpassword' } });

            // Klik tombol submit
            await act(async () => {
                fireEvent.click(screen.getByRole('button', { name: 'Masuk' }));
            });

            // Tunggu toast dengan pesan error yang benar muncul
            await waitFor(() => {
                expect(screen.getByTestId('toast')).toBeInTheDocument();
                expect(screen.getByText('Login gagal, periksa kembali data yang Anda masukkan.')).toBeInTheDocument();
            });
        });

        test('handles network error', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));

            renderWithRouter(<Login />);

            const emailInput = screen.getByPlaceholderText('kamu@contoh.com');
            const passwordInput = screen.getByPlaceholderText('6 karakter atau lebih');
            const submitButton = screen.getByRole('button', { name: 'Masuk' });

            await act(async () => {
                fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
                fireEvent.change(passwordInput, { target: { value: 'Password123' } });
            });

            await act(async () => {
                fireEvent.click(submitButton);
            });

            await waitFor(() => {
                expect(screen.getByTestId('toast')).toBeInTheDocument();
                expect(screen.getByText('Terjadi Kesalahan pada server!')).toBeInTheDocument();
            });
        });

        test('shows loading state during submission', async () => {
            const mockResponse = {
                status: "success",
                code: 200,
                message: "Login berhasil",
                data: {
                    user: {
                        id: 10,
                        nama: "example-name",
                        email: "example@gmail.com",
                        createdAt: "createdDate"
                    },
                    auth: {
                        accessToken: "example-accessToken",
                        tokenType: "Bearer",
                        expireIn: 3600
                    }
                }
            };

            // Delay the fetch response
            fetch.mockImplementationOnce(() =>
                new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
            );

            renderWithRouter(<Login />);

            const emailInput = screen.getByPlaceholderText('kamu@contoh.com');
            const passwordInput = screen.getByPlaceholderText('6 karakter atau lebih');
            const submitButton = screen.getByRole('button', { name: 'Masuk' });

            await act(async () => {
                fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
                fireEvent.change(passwordInput, { target: { value: 'Password123' } });
            });

            await act(async () => {
                fireEvent.click(submitButton);
            });

            expect(screen.getByRole('button', { name: 'Memproses...' })).toBeInTheDocument();
            expect(submitButton).toBeDisabled();

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument();
            });
        });
    });

    // Test Google Sign In
    describe('Google Sign In', () => {
        beforeEach(() => {
            mockSignInWithPopup.mockClear();
        });
        test('handles successful Google sign-in', async () => {
            mockSignInWithPopup.mockResolvedValue({
                user: {
                    getIdToken: jest.fn().mockResolvedValue('mock-id-token'),
                    email: 'john@example.com',
                    displayName: 'John Doe'
                }
            });

            const mockResponse = {
                ok: true,
                json: () => Promise.resolve({
                    message: 'Google login berhasil',
                    data: {
                        auth: { accessToken: 'google-token' },
                        user: { id: 1, name: 'Test User' }
                    }
                })
            };

            fetch.mockResolvedValueOnce(mockResponse);

            renderWithRouter(<Login />);

            const googleButton = screen.getByRole('button', { name: 'Google' });

            console.log('--- Debugging Tombol Google Sebelum Klik ---');
            screen.debug(googleButton);

            expect(googleButton).toBeEnabled();

            await act(async () => {
                fireEvent.click(googleButton);
            });

            expect(mockSignInWithPopup).toHaveBeenCalled();

            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith('https://ruangilmu.up.railway.app/auth/oauth-google', {
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

    // Test Toast functionality
    describe('Toast Functionality', () => {
        test('shows toast from sessionStorage on mount', () => {
            sessionStorage.setItem('loginStatus', 'success');

            renderWithRouter(<Login />);

            expect(screen.getByTestId('toast')).toBeInTheDocument();
            expect(screen.getByText('Login berhasil!')).toBeInTheDocument();
        });

        test('shows error toast from sessionStorage on mount', () => {
            sessionStorage.setItem('loginStatus', 'error');

            renderWithRouter(<Login />);

            expect(screen.getByTestId('toast')).toBeInTheDocument();
            expect(screen.getByText('Email atau kata sandi salah!')).toBeInTheDocument();
        });
    });
})