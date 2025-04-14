const userService = require('../services/userService');
const authService = require('../services/authService');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/tokenUtils');
const httpStatus = require('../constants/httpStatus');

exports.register = async (req, res) => {
    try {
        const { nama, email, password } = req.body;

        const existingUser = await userService.findByEmail(email);
        if (existingUser) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: 'Email already in use' });
        }

        const hashedPassword = await hashPassword(password);
        const user = await userService.create(nama, email, hashedPassword);
        const token = generateToken({ id: user.user_id });

        res.status(httpStatus.CREATED).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.user_id,
                nama: user.nama,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);

        res.status(httpStatus.OK).json({
            message: 'Login successful',
            token,
            user: {
                id: user.user_id,
                nama: user.nama,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(httpStatus.UNAUTHORIZED).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await authService.getMe(req.user.id);
        res.status(httpStatus.OK).json({ user });
    } catch (error) {
        console.error(error.message);
        res.status(httpStatus.NOT_FOUND).json({ message: error.message });
    }
};
