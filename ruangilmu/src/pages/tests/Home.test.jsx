import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom'
import Home from "../Home";
import CourseCard from "../../components/jsx/CourseCard";
import Footer from "../../components/jsx/Footer";

// Mock the apiService used for fetching courses
jest.mock('../../components/utils/authMiddleware', () => ({
    apiService: {
        get: jest.fn(),
    },
}));
import { apiService } from '../../components/utils/authMiddleware';

jest.mock('../../components/jsx/Navbar', () => {

    const { Link } = require('react-router-dom');
    return function MockNavbar({ isLoggedIn }) {
        return (
            <nav data-testid="navbar">
                <div>
                    <Link to="/">Beranda</Link>
                    <Link to="/course">Kelas</Link>
                    <Link to="/dashboard">Dasbor</Link>
                </div>

                <div>
                    {isLoggedIn ? (
                        <>
                            <Link to="/profile" data-testid="profile-link">
                                Profile
                            </Link>
                            <button data-testid="logout-button">Keluar</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Masuk</Link>
                            <Link to="/register">Daftar</Link>
                        </>
                    )}
                </div>
            </nav>
        );
    };
});

// Helper function to render component with router
const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

// Mock data for courses
const mockCourses = [
    { course_id: 1, course_name: 'Matematika Dasar', course_description: 'Belajar penjumlahan dan pengurangan.', course_price: 100000, created_at: '2023-10-27T10:00:00Z' },
    { course_id: 2, course_name: 'Matematika menengah', course_description: 'Pengenalan perkalian dan pembagian.', course_price: 0, created_at: '2023-10-28T11:00:00Z' },
];

describe('Home Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
        localStorage.clear();
        apiService.get.mockReset();
    });

    describe('Rendering', () => {
        test('render hero section correctly', async () => {
            apiService.get.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });
            renderWithRouter(<Home />);

            expect(screen.getByText(/Ruang Hidup Belajar/i)).toBeInTheDocument();
            expect(screen.getByText(/Perluas/i)).toBeInTheDocument();
            expect(screen.getByAltText('Kids_Image')).toBeInTheDocument();
        });

        test('render subject section correctly', async () => {
            apiService.get.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });
            renderWithRouter(<Home />);

            expect(screen.getByText(/Materi untuk/i)).toBeInTheDocument();
            expect(screen.getByRole('combobox', { name: /Materi untuk/i }).value).toBe('Kelas 4');
            // expect(screen.getByRole('combobox', { name: /Semester/i })).toBeInTheDocument();
        });

        test('render call to action section when not logged in correctly', async () => {
            apiService.get.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });
            renderWithRouter(<Home />);

            expect(screen.getByText(/Siap memulai perjalanan belajarmu?/i)).toBeInTheDocument();
            expect(screen.getAllByText(/DAFTAR SEKARANG/i).length).toBeGreaterThan(0);
        });
    });

    describe('authentication', () => {
        test('shows register button when user is not logged in', async () => {
            apiService.get.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });
            renderWithRouter(<Home />);

            const registerButtons = screen.getAllByRole('link', { name: /DAFTAR SEKARANG/i });
            expect(registerButtons.length).toBe(2);
        });

        test('hides register button when user is not logged in', async () => {
            localStorage.setItem('accessToken', 'example-token');
            apiService.get.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });
            renderWithRouter(<Home />);

            const registerButtons = screen.queryAllByRole('link', { name: /DAFTAR SEKARANG/i });
            expect(registerButtons.length).toBe(0);
            expect(screen.queryByText(/Siap memulai perjalanan belajarmu?/i)).not.toBeInTheDocument();
        });

        test('passes correct login status to navbar', async () => {
            apiService.get.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });

            // Test logged out state
            const { unmount } = renderWithRouter(<Home />);
            expect(screen.getByText('Masuk')).toBeInTheDocument();
            expect(screen.getByText('Daftar')).toBeInTheDocument();
            expect(screen.queryByTestId('profile-link')).not.toBeInTheDocument();
            unmount();

            // Test logged in state
            localStorage.setItem('accessToken', 'dummy-token');
            renderWithRouter(<Home />);
            await waitFor(() => {
                expect(screen.getByTestId('profile-link')).toBeInTheDocument();
            });
            expect(screen.getByTestId('logout-button')).toBeInTheDocument();
            expect(screen.queryByText('Masuk')).not.toBeInTheDocument();
        });
    });

    describe('course loading', () => {
        test('shows loading spinner initially', async () => {
            // Mock a pending promise
            apiService.get.mockImplementation(() => new Promise(() => { }));
            renderWithRouter(<Home />);

            // The spinner is a div with a specific class, we check for its presence
            const spinner = document.querySelector('.animate-spin');
            expect(spinner).toBeInTheDocument();
        });

        test('displays courses when loaded successfully', async () => {
            apiService.get.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ data: mockCourses }),
            });
            renderWithRouter(<Home />);

            await waitFor(() => {
                expect(screen.getByText('Matematika Dasar')).toBeInTheDocument();
                expect(screen.getByText('Matematika menengah')).toBeInTheDocument();
            });
            expect(screen.queryByText(/Gagal Menampilkan kelas/i)).not.toBeInTheDocument();
        });

        test('displays error message when courses fail to load', async () => {
            apiService.get.mockRejectedValue(new Error('Network Error'));
            renderWithRouter(<Home />);

            await waitFor(() => {
                expect(screen.getByText(/Gagal Menampilkan kelas, coba sesaat lagi/i)).toBeInTheDocument();
            });
            expect(screen.queryByText('Matematika Dasar')).not.toBeInTheDocument();
        });

        test('displays error message when API returns not ok', async () => {
            apiService.get.mockResolvedValue({ ok: false });
            renderWithRouter(<Home />);

            await waitFor(() => {
                expect(screen.getByText(/Gagal Menampilkan kelas, coba sesaat lagi/i)).toBeInTheDocument();
            });
        });
    });

    describe('API Integration', () => {
        test('calls API with correct endpoint', async () => {
            apiService.get.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });
            renderWithRouter(<Home />);

            await waitFor(() => {
                expect(apiService.get).toHaveBeenCalledWith('http://ruangilmu.up.railway.app/courses');
                expect(apiService.get).toHaveBeenCalledTimes(1);
            });
        });

        test('handles API response correctly', async () => {
            apiService.get.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ data: mockCourses }),
            });
            renderWithRouter(<Home />);

            expect(await screen.findByText('Matematika Dasar')).toBeInTheDocument();
            expect(screen.getByText(/Belajar penjumlahan dan pengurangan./i)).toBeInTheDocument();
        });
    });

    describe('component state', () => {
        test('initializes with correct default values', async () => {
            apiService.get.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });
            renderWithRouter(<Home />);

            expect(screen.getByRole('combobox', { name: /Materi untuk/i }).value).toBe('Kelas 4');
            // expect(screen.getByRole('combobox', { name: /Semester/i }).value).toBe('Semester 1');
        });

        test('manages loading state correctly', async () => {
            apiService.get.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ data: mockCourses }),
            });
            renderWithRouter(<Home />);

            // Initially, spinner should be there
            expect(document.querySelector('.animate-spin')).toBeInTheDocument();

            // After data is fetched, spinner should be gone
            await waitFor(() => {
                expect(screen.getByText('Matematika Dasar')).toBeInTheDocument();
            });
            expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
        });
    });

    describe('error handling', () => {
        test('handles network errors gracefully', async () => {
            apiService.get.mockRejectedValue(new Error('Network error'));
            renderWithRouter(<Home />);

            const errorMessage = await screen.findByText(/Gagal Menampilkan kelas, coba sesaat lagi/i);
            expect(errorMessage).toBeInTheDocument();
        });
    });
}); 