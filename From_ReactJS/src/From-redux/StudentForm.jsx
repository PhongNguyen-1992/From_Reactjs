import React from 'react';
import { useStudentForm } from '../store/hook'; 

const StudentForm = () => {
  const {
    form,
    validation,
    handleSubmit,
    handleChange,
    handleBlur,
    handleFocus,
    getFieldValidation
  } = useStudentForm();

  const onSubmit = (e) => {
    const result = handleSubmit(e);
    if (result.success) {
      alert(result.message);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Thêm Sinh Viên Mới
      </h2>
      
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Mã sinh viên */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mã sinh viên *
          </label>
          <input
            type="text"
            name="maSV"
            value={form.maSV}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldValidation('maSV').error
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white`}
            placeholder="Nhập mã sinh viên"
          />
          {getFieldValidation('maSV').error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {getFieldValidation('maSV').error}
            </p>
          )}
        </div>

        {/* Họ và tên */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Họ và tên *
          </label>
          <input
            type="text"
            name="hoVaTen"
            value={form.hoVaTen}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldValidation('hoVaTen').error
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white`}
            placeholder="Nhập họ và tên"
          />
          {getFieldValidation('hoVaTen').error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {getFieldValidation('hoVaTen').error}
            </p>
          )}
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Số điện thoại *
          </label>
          <input
            type="text"
            name="SDT"
            value={form.SDT}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldValidation('SDT').error
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white`}
            placeholder="Nhập số điện thoại"
          />
          {getFieldValidation('SDT').error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {getFieldValidation('SDT').error}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldValidation('email').error
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white`}
            placeholder="Nhập email"
          />
          {getFieldValidation('email').error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {getFieldValidation('email').error}
            </p>
          )}
        </div>

        {/* Error summary */}
        {validation.shouldShowSummary && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">
              Vui lòng kiểm tra lại thông tin đã nhập
            </p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={!validation.isValid && validation.hasVisibleErrors}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            !validation.isValid && validation.hasVisibleErrors
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Thêm sinh viên
        </button>
      </form>
    </div>
  );
};

export default StudentForm;