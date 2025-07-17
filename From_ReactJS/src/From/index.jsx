import { useState } from "react";
import StudentTable from "./table";
export default function From() {
  const [state, setState] = useState({
    maSV: "",
    hoVaTen: "",
    SDT: "",
    email: "",
  });

  const [students, setStudents] = useState([]);

  const handleOnchange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    setState({
      ...state,
      [name]: value  // ✅ Không cần nested object
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Kiểm tra xem tất cả các trường đã được điền chưa
    if (state.maSV && state.hoVaTen && state.SDT && state.email) {
      // Thêm sinh viên mới vào danh sách
      setStudents([...students, { ...state, id: Date.now() }]);
      
      // Reset form
      setState({
        maSV: "",
        hoVaTen: "",
        SDT: "",
        email: "",
      });
    } else {
      alert("Vui lòng điền đầy đủ thông tin!");
    }
  };

  const handleDelete = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  return (
    <div className="container mx-auto mt-5 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Quản Lý Thông Tin Sinh Viên
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="mb-5">
          <label
            htmlFor="maSV"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Mã Sinh Viên
          </label>
          <input
            name="maSV"
            value={state.maSV}
            onChange={handleOnchange}
            type="text"
            id="maSV"
            placeholder="Nhập mã số sinh viên..."
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-5">
          <label
            htmlFor="hoVaTen"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Họ Và Tên Sinh Viên
          </label>
          <input
            name="hoVaTen"
            value={state.hoVaTen}
            onChange={handleOnchange}
            type="text"
            id="hoVaTen"
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Nhập họ và tên..."
            required
          />
        </div>
        
        <div className="mb-5">
          <label
            htmlFor="SDT"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Số Điện Thoại
          </label>
          <input
            name="SDT"
            value={state.SDT}
            onChange={handleOnchange}
            type="tel" 
            id="SDT"
            placeholder="Nhập số điện thoại..."
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            name="email"
            value={state.email}
            onChange={handleOnchange}
            type="email"
            id="email"
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@example.com"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <button
            onClick={handleSubmit}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Thêm Sinh Viên
          </button>
        </div>
      </div>      
      <StudentTable students={students} onDelete={handleDelete} />
    </div>
  );
}