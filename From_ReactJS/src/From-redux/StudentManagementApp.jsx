import React from "react";
import { useStudentData } from "../store/hook";   
import StudentTable from "./StudentTable";
import StudentForm from "./StudentForm";

function StudentManagementApp() {
  const { stats } = useStudentData();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quản Lý Sinh Viên
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Hệ thống quản lý thông tin sinh viên
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.total}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Tổng sinh viên
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <StudentForm />

        {/* Table */}
        <StudentTable />
      </div>
    </div>
  );
}

export default StudentManagementApp;