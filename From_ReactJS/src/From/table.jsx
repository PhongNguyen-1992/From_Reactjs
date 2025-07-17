
import React, { useState } from "react";

function StudentTable({ students, onDelete }) {
  if (students.length === 0) {
    return (
      <div className="mt-8 text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Chưa có sinh viên nào được thêm vào danh sách
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Danh Sách Sinh Viên ({students.length})
      </h2>
      
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">STT</th>
              <th scope="col" className="px-6 py-3">Mã Sinh Viên</th>
              <th scope="col" className="px-6 py-3">Họ và Tên</th>
              <th scope="col" className="px-6 py-3">Số Điện Thoại</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {index + 1}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {student.maSV}
                </td>
                <td className="px-6 py-4">{student.hoVaTen}</td>
                <td className="px-6 py-4">{student.SDT}</td>
                <td className="px-6 py-4">{student.email}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onDelete(student.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium hover:underline"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default StudentTable