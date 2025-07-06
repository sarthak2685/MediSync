import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import axios from 'axios';
import { specialties } from '../constants';

const Register = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    phone: '',
    gender: '',
    dob: '',
    specialization: [],
    experience: '',
    qualifications: [{ degree: '', institute: '', year: '' }],
    bio: '',
    consultationFee: '',
    bloodGroup: '',
    height: '',
    weight: ''
  });
  const [errors, setErrors] = useState({});
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleMultiSelect = (e) => {
    const options = [...e.target.selectedOptions];
    const values = options.map(opt => opt.value);
    setFormData(prev => ({ ...prev, specialization: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (Array.isArray(formData[key])) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert(`Registered successfully as ${formData.role}! ${formData.role === 'doctor' ? 'Your account needs admin approval.' : ''}`);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.email) newErrors.email = 'Required';
    if (!formData.password) newErrors.password = 'Required';
    if (formData.password.length < 3) newErrors.password = 'Min 3 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';
    if (!formData.phone) newErrors.phone = 'Required';
    if (!formData.gender) newErrors.gender = 'Required';
    if (!formData.dob) newErrors.dob = 'Required';
    
    if (formData.role === 'doctor') {
      if (formData.specialization.length === 0) newErrors.specialization = 'Select at least one';
      if (!formData.experience) newErrors.experience = 'Required';
      if (!avatar) newErrors.avatar = 'Profile picture is required';

    } else {
      if (!formData.bloodGroup) newErrors.bloodGroup = 'Required';
      if (!formData.height) newErrors.height = 'Required';
      if (!formData.weight) newErrors.weight = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div ref={formRef} className="bg-white rounded-lg shadow-xl p-8 w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${errors.gender ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${errors.dob ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              />
              {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
            </div>
          </div>

          {/* Role-Specific Fields */}
          {formData.role === 'doctor' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
                  <select
                    multiple
                    value={formData.specialization}
                    onChange={handleMultiSelect}
                    className={`w-full px-4 py-2 rounded-md border ${errors.specialization ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent h-auto min-h-[42px]`}
                    size="4"
                  >
                    {specialties.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                  {errors.specialization && <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>}
                  <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    name="experience"
                    min="0"
                    value={formData.experience}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border ${errors.experience ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                  {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
                </div>
                <div>
                <label className="block text-sm text-gray-600 mb-1">Profile Picture</label>
                <input
                  type="file"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  accept="image/*"
                  className="w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"  
                  value={formData.bio}
                  onChange={handleChange} 
                  className={`w-full px-4 py-2 rounded-md border ${errors.bio ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                <input
                  type="number"
                  name="consultationFee"  
                  value={formData.consultationFee}
                  onChange={handleChange} 
                  className={`w-full px-4 py-2 rounded-md border ${errors.consultationFee ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
              </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                {formData.qualifications.map((qual, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <input
                      type="text"
                      placeholder="Degree"
                      value={qual.degree}
                      onChange={(e) => {
                        const updated = [...formData.qualifications];
                        updated[index].degree = e.target.value;
                        setFormData(prev => ({ ...prev, qualifications: updated }));
                      }}
                      className="px-3 py-2 rounded-md border border-gray-300"
                    />
                    <input
                      type="text"
                      placeholder="Institute"
                      value={qual.institute}
                      onChange={(e) => {
                        const updated = [...formData.qualifications];
                        updated[index].institute = e.target.value;
                        setFormData(prev => ({ ...prev, qualifications: updated }));
                      }}
                      className="px-3 py-2 rounded-md border border-gray-300"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Year"
                        value={qual.year}
                        onChange={(e) => {
                          const updated = [...formData.qualifications];
                          updated[index].year = e.target.value;
                          setFormData(prev => ({ ...prev, qualifications: updated }));
                        }}
                        className="flex-1 px-3 py-2 rounded-md border border-gray-300"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.qualifications.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, qualifications: updated }));
                          }}
                          className="px-3 py-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      qualifications: [...prev.qualifications, { degree: '', institute: '', year: '' }]
                    }));
                  }}
                  className="mt-2 text-sm text-purple-600 hover:text-purple-800"
                >
                  + Add Qualification
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md border ${errors.bloodGroup ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                {errors.bloodGroup && <p className="mt-1 text-sm text-red-600">{errors.bloodGroup}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Profile Picture</label>
                <input
                  type="file"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  accept="image/*"
                  className="w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  min="0"
                  value={formData.height}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md border ${errors.height ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
                {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  min="0"
                  value={formData.weight}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md border ${errors.weight ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
                {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition duration-200"
            >
              Register
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 hover:text-purple-800 font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;