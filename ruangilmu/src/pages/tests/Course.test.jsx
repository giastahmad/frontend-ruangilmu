import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom'
import CoursesPage from "../Course";
import { apiService } from "../../components/utils/authMiddleware";

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

jest.mock('../../components/utils/authMiddleware', () => ({
    apiService: {
        get: jest.fn()
    }
}));

jest.mock('../../components/jsx/CourseCard', () => {
    return function MockCourseCard({ course }) {
        return (
            <div data-testid="course-card" data-course-id={course.course_id}>
                <h3>{course.course_name}</h3>
                <p>{course.course_description}</p>
            </div>
        );
    };
});

// Mock data
const mockCoursesData = {
    data: [
        {
            course_id: 1,
            course_name: "Matematika Kelas 4",
            course_description: "Belajar matematika dasar untuk kelas 4",
            course_image_cover: "image1.jpg",
            course_price: 100000,
            created_at: "2024-01-15T00:00:00Z",
            grade: "Kelas 4"
        },
        {
            course_id: 2,
            course_name: "Matematika Kelas 5",
            course_description: "Pelajaran MTK untuk kelas 5",
            course_image_cover: "image2.jpg",
            course_price: 0,
            created_at: "2024-01-20T00:00:00Z",
            grade: "Kelas 5"
        },
        {
            course_id: 3,
            course_name: "Matematika Kelas 6",
            course_description: "MTK untuk siswa kelas 6",
            course_image_cover: "image3.jpg",
            course_price: 150000,
            created_at: "2024-01-25T00:00:00Z",
            grade: "Kelas 6"
        }
    ]
};

// Helper function to render component with router
const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('Course Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
        localStorage.clear();
        apiService.get.mockResolvedValue({
            ok: true,
            json: async () => mockCoursesData
        });
    });

    describe('Rendering', () => {
        test('should render the main layout, including Navbar, and titles', async () => {
            await act(async () => {
                renderWithRouter(<CoursesPage />);
            });

            await waitFor(() => {
                expect(screen.getByTestId('navbar')).toBeInTheDocument();
                expect(screen.getByText('Daftar Program')).toBeInTheDocument();
                expect(screen.getByText('Daftar Kelas')).toBeInTheDocument();
            });
        });

        test('should render the category list correctly', async () => {
            await act(async () => {
                renderWithRouter(<CoursesPage />);
            });

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Semua Kelas' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Kelas 4' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Kelas 5' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Kelas 6' })).toBeInTheDocument();
            });
        });

        test('should set "Semua Kelas" as the active category by default', async () => {
            await act(async () => {
                renderWithRouter(<CoursesPage />);
            });

            await waitFor(() => {
                const semuaKelasButton = screen.getByRole('button', { name: 'Semua Kelas' });
                expect(semuaKelasButton).toHaveClass('bg-[#0B7077]', 'text-white');
            });
        });

        test('should render pagination controls', async () => {
            await act(async () => {
                renderWithRouter(<CoursesPage />);
            });

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
            });
        });
    });

    describe('Data Fetching and Display', () => {
        test('should display a loading spinner while fetching courses', async () => {
            apiService.get.mockImplementation(() =>
                new Promise(resolve => setTimeout(() => resolve({
                    ok: true,
                    json: async () => mockCoursesData
                }), 100))
            );

            await act(async () => {
                renderWithRouter(<CoursesPage />);
            });

            const spinner = document.querySelector('.animate-spin');
            expect(spinner).toBeInTheDocument();

            await waitFor(() => {
                expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
            }, { timeout: 2000 });
        });

        test('should display courses correctly after a successful API call', async () => {
            await act(async () => {
                renderWithRouter(<CoursesPage />);
            });

            await waitFor(() => {
                expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();

                expect(screen.getAllByTestId('course-card')).toHaveLength(3);
                expect(screen.getByText('Matematika Kelas 4')).toBeInTheDocument();
                expect(screen.getByText('Matematika Kelas 5')).toBeInTheDocument();
                expect(screen.getByText('Matematika Kelas 6')).toBeInTheDocument();
            });
        });

        test('should display an error message if the API call fails', async () => {
            apiService.get.mockRejectedValue(new Error('Network error'));

            await act(async () => {
                renderWithRouter(<CoursesPage />);
            });

            await waitFor(() => {
                expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();

                expect(screen.getByText('Gagal Menampilkan kelas, coba sesaat lagi')).toBeInTheDocument();
            });
        });
    });

    describe('Category Filtering Interaction', () => {
        test('should change the active category when a category button is clicked', async () => {
            await act(async () => {
                renderWithRouter(<CoursesPage />);
            });

            await waitFor(() => {
                expect(screen.getAllByTestId('course-card')).toHaveLength(3);
            });

            const kelas5Button = screen.getByRole('button', { name: 'Kelas 5' });
            await act(async () => {
                fireEvent.click(kelas5Button);
            });

            expect(kelas5Button).toHaveClass('bg-[#0B7077]', 'text-white');

            const semuaKelasButton = screen.getByRole('button', { name: 'Semua Kelas' });
            expect(semuaKelasButton).not.toHaveClass('bg-[#0B7077]', 'text-white');
            expect(semuaKelasButton).toHaveClass('hover:bg-gray-100');
        });

        test('should filter the displayed courses based on the selected category', () => {
            // Catatan: Fungsionalitas filtering belum diimplementasikan di kode.
            // Saat ini, mengklik kategori hanya mengubah state `activeCategory` tetapi tidak memfilter `courses`.
        });

        test('should reset to page 1 when a new category is selected', async () => {
            await act(async () => {
                renderWithRouter(<CoursesPage />);
            });

            await waitFor(() => {
                expect(screen.getAllByTestId('course-card')).toHaveLength(3);
            });

            const page2Button = screen.getByRole('button', { name: '2' });
            await act(async () => {
                fireEvent.click(page2Button);
            });

            expect(page2Button).toHaveClass('bg-[#0B7077]', 'text-white');

            const kelas6Button = screen.getByRole('button', { name: 'Kelas 6' });
            await act(async () => {
                fireEvent.click(kelas6Button);
            });

            const page1Button = screen.getByRole('button', { name: '1' });
            expect(page1Button).toHaveClass('bg-[#0B7077]', 'text-white');
            expect(page2Button).not.toHaveClass('bg-[#0B7077]', 'text-white');
        });
    });

    describe('Pagination Interaction', () => {
        test('should highlight page 1 as the current page by default', async () => {
            await act(async () => {
                renderWithRouter(<CoursesPage />);
            });

            await waitFor(() => {
                const page1Button = screen.getByRole('button', { name: '1' });
                expect(page1Button).toHaveClass('bg-[#0B7077]', 'text-white');
            });
        });

        test('should navigate to the correct page when a page number is clicked', async () => {
            await act(async () => {
                renderWithRouter(<CoursesPage />);
            });

            await waitFor(() => {
                expect(screen.getAllByTestId('course-card')).toHaveLength(3);
            });

            const page2Button = screen.getByRole('button', { name: '2' });
            await act(async () => {
                fireEvent.click(page2Button);
            });

            expect(page2Button).toHaveClass('bg-[#0B7077]', 'text-white');

            const page1Button = screen.getByRole('button', { name: '1' });
            expect(page1Button).not.toHaveClass('bg-[#0B7077]', 'text-white');
        });

        test('should navigate to the next page when the "Next" button is clicked', async () => {
            await act(async () => {
                renderWithRouter(<CoursesPage />);
            });

            await waitFor(() => {
                expect(screen.getAllByTestId('course-card')).toHaveLength(3);
            });

            const nextButton = screen.getByRole('button', { name: 'Next' });
            await act(async () => {
                fireEvent.click(nextButton);
            });

            const page2Button = screen.getByRole('button', { name: '2' });
            expect(page2Button).toHaveClass('bg-[#0B7077]', 'text-white');
        });

        test('should navigate to the previous page when the "Previous" button is clicked', async () => {
            await act(async () => {
                renderWithRouter(<CoursesPage />);
            });

            await waitFor(() => {
                expect(screen.getAllByTestId('course-card')).toHaveLength(3);
            });

            const page2Button = screen.getByRole('button', { name: '2' });
            await act(async () => {
                fireEvent.click(page2Button);
            });

            expect(page2Button).toHaveClass('bg-[#0B7077]', 'text-white');

            const previousButton = screen.getByRole('button', { name: 'Previous' });
            await act(async () => {
                fireEvent.click(previousButton);
            });

            const page1Button = screen.getByRole('button', { name: '1' });
            expect(page1Button).toHaveClass('bg-[#0B7077]', 'text-white');
        });

        test('should not go to a page less than 1 when "Previous" is clicked on the first page', async () => {
            await act(async () => {
                renderWithRouter(<CoursesPage />);
            });

            await waitFor(() => {
                expect(screen.getAllByTestId('course-card')).toHaveLength(3);
            });

            const page1Button = screen.getByRole('button', { name: '1' });
            expect(page1Button).toHaveClass('bg-[#0B7077]', 'text-white');

            const previousButton = screen.getByRole('button', { name: 'Previous' });
            await act(async () => {
                fireEvent.click(previousButton);
            });

            expect(page1Button).toHaveClass('bg-[#0B7077]', 'text-white');
        });

        test('should not go beyond the last page when "Next" is clicked on the last page', async () => {
            await act(async () => {
                renderWithRouter(<CoursesPage />);
            });

            await waitFor(() => {
                expect(screen.getAllByTestId('course-card')).toHaveLength(3);
            });

            const page3Button = screen.getByRole('button', { name: '3' });
            await act(async () => {
                fireEvent.click(page3Button);
            });

            expect(page3Button).toHaveClass('bg-[#0B7077]', 'text-white');

            const nextButton = screen.getByRole('button', { name: 'Next' });
            await act(async () => {
                fireEvent.click(nextButton);
            });

            expect(page3Button).toHaveClass('bg-[#0B7077]', 'text-white');
        });
    });

    describe('Authentication Status', () => {
        test('should pass isLoggedIn as true to Navbar if accessToken exists in localStorage', async () => {
            localStorage.setItem('accessToken', 'dummy-token');

            await act(async () => {
                renderWithRouter(<CoursesPage />);
            });

            await waitFor(() => {
                expect(screen.queryByTestId('profile-link')).toBeInTheDocument();
            });
        });

        test('should pass isLoggedIn as false to Navbar if accessToken does not exist', async () => {
            localStorage.removeItem('accessToken');

            await act(async () => {
                renderWithRouter(<CoursesPage />);
            });

            await waitFor(() => {
                expect(screen.getByText('Masuk')).toBeInTheDocument();
                expect(screen.getByText('Daftar')).toBeInTheDocument();
                expect(screen.queryByTestId('profile-link')).not.toBeInTheDocument();
            });
        });
    });
});