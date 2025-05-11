'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.fname) newErrors.fname = 'First name is required';
    if (!formData.lname) newErrors.lname = 'Last name is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!accepted) newErrors.accepted = 'Please accept the terms';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Submitting:', formData);
      setMessage('Form submitted successfully!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3498db]">
      <div className="bg-white rounded-md shadow-md p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Sign Up</h2>
        <p className="text-sm text-gray-600 mb-4">
          Please fill in this form to create an account!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 mb-4">
            <div className="w-1/2">
              <input
                type="text"
                name="fname"
                placeholder="First Name"
                value={formData.fname}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.fname ? 'border-red-500' : 'border-gray-300'
                } rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3498db]`}
              />
              {errors.fname && (
                <p className="text-red-500 text-sm mt-1">{errors.fname}</p>
              )}
            </div>
            <div className="w-1/2">
              <input
                type="text"
                name="lname"
                placeholder="Last Name"
                value={formData.lname}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.lname ? 'border-red-500' : 'border-gray-300'
                } rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3498db]`}
              />
              {errors.lname && (
                <p className="text-red-500 text-sm mt-1">{errors.lname}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3498db]`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3498db]`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3498db]`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-600"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I accept the{' '}
              <a href="#" className="text-[#3498db] hover:underline">
                Terms of Use
              </a>{' '}
              &{' '}
              <a href="#" className="text-[#3498db] hover:underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>
          {errors.accepted && (
            <p className="text-red-500 text-sm mt-1">{errors.accepted}</p>
          )}

          <button
            type="submit"
            className="w-full text-center text-sm text-white mt-6 bg-[#3498db] py-3 rounded-md hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>

        {message && (
          <p className="text-green-600 text-center mt-4 font-medium">{message}</p>
        )}

        <p className="text-center text-sm text-white mt-6 bg-gray-400 py-3 rounded-b-md">
          Already have an account?{' '}
          <Link href="/login" className="text-white underline font-medium">
            Login here.
          </Link>
        </p>
      </div>
    </div>
  );
}
