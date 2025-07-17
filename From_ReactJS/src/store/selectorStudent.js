import { createSelector } from "@reduxjs/toolkit";

// Base selectors
export const selectStudentState = (state) => state.student;
export const selectStudents = (state) => state.student.students;
export const selectForm = (state) => state.student.form;
export const selectFormTouched = (state) => state.student.formTouched;
export const selectFormSubmitted = (state) => state.student.formSubmitted;
export const selectFilter = (state) => state.student.filter;
export const selectLoading = (state) => state.student.loading;
export const selectError = (state) => state.student.error;

//chuẩn hóa text cho tìm kiếm
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Thay thế nhiều khoảng trắng bằng 1
    .normalize('NFD') // Chuẩn hóa Unicode
    .replace(/[\u0300-\u036f]/g, ''); // Loại bỏ dấu tiếng Việt
};

// tìm kiếm linh hoạt
const isMatchingSearch = (searchText, filterText) => {
  const normalizedSearch = normalizeText(searchText);
  const normalizedFilter = normalizeText(filterText);
  
  // Tìm kiếm chính xác
  if (normalizedSearch.includes(normalizedFilter)) {
    return true;
  }
  
  // Tìm kiếm từng từ riêng biệt
  const filterWords = normalizedFilter.split(' ').filter(word => word.length > 0);
  const searchWords = normalizedSearch.split(' ');
  
  return filterWords.every(filterWord => 
    searchWords.some(searchWord => 
      searchWord.includes(filterWord) || filterWord.includes(searchWord)
    )
  );
};

//Cải thiện logic tìm kiếm
export const selectFilteredStudents = createSelector(
  [selectStudents, selectFilter],
  (students, filter) => {
    if (!filter || !filter.trim()) return students;
    
    const trimmedFilter = filter.trim();
    
    return students.filter(student => {
      // Tìm kiếm trong tên
      const nameMatch = isMatchingSearch(student.hoVaTen, trimmedFilter);
      
      // Tìm kiếm trong mã SV
      const idMatch = isMatchingSearch(student.maSV, trimmedFilter);
      
      // Tìm kiếm trong email
      const emailMatch = isMatchingSearch(student.email, trimmedFilter);
      
      // Tìm kiếm trong SĐT
      const phoneMatch = isMatchingSearch(student.SDT, trimmedFilter);
      
      return nameMatch || idMatch || emailMatch || phoneMatch;
    });
  }
);

// Selector để đếm tổng số sinh viên
export const selectStudentCount = createSelector(
  [selectStudents],
  (students) => students.length
);

// Selector để đếm sinh viên sau khi lọc
export const selectFilteredStudentCount = createSelector(
  [selectFilteredStudents],
  (filteredStudents) => filteredStudents.length
);

// Selector để kiểm tra form có valid không
export const selectIsFormValid = createSelector(
  [selectForm],
  (form) => {
    return !!(form.maSV && form.hoVaTen && form.SDT && form.email);
  }
);

// Selector để tìm sinh viên theo ID
export const selectStudentById = createSelector(
  [selectStudents, (state, studentId) => studentId],
  (students, studentId) => {
    return students.find(student => student.id === studentId);
  }
);

// Selector để kiểm tra mã sinh viên đã tồn tại chưa
export const selectIsStudentIdExists = createSelector(
  [selectStudents, (state, maSV) => maSV],
  (students, maSV) => {
    if (!maSV || !maSV.trim()) return false;
    const normalizedMaSV = maSV.trim().toLowerCase();
    return students.some(student => 
      student.maSV.toLowerCase() === normalizedMaSV
    );
  }
);

// Selector để kiểm tra email đã tồn tại chưa
export const selectIsEmailExists = createSelector(
  [selectStudents, (state, email) => email],
  (students, email) => {
    if (!email || !email.trim()) return false;
    const normalizedEmail = email.trim().toLowerCase();
    return students.some(student => 
      student.email.toLowerCase() === normalizedEmail
    );
  }
);

// Selector để validation form với touched state - optimized
export const selectFormValidation = createSelector(
  [selectForm, selectFormTouched, selectFormSubmitted, selectStudents],
  (form, touched, submitted, students) => {
    const allErrors = {};
    const visibleErrors = {};
    
    // Chỉ validate khi cần thiết
    const shouldValidate = submitted || Object.values(touched).some(Boolean);
    
    if (shouldValidate) {
      // Validate mã sinh viên
      if (!form.maSV.trim()) {
        allErrors.maSV = "Mã sinh viên không được để trống";
      } else if (form.maSV.trim().length < 6) {
        allErrors.maSV = "Mã sinh viên phải có ít nhất 6 ký tự";
      } else if (students.some(s => s.maSV.toLowerCase() === form.maSV.trim().toLowerCase())) {
        allErrors.maSV = "Mã sinh viên đã tồn tại";
      }
      
      // Validate họ tên
      if (!form.hoVaTen.trim()) {
        allErrors.hoVaTen = "Họ và tên không được để trống";
      } else if (form.hoVaTen.trim().length < 2) {
        allErrors.hoVaTen = "Họ và tên phải có ít nhất 2 ký tự";
      }
      
      // Validate SĐT
      if (!form.SDT.trim()) {
        allErrors.SDT = "Số điện thoại không được để trống";
      } else if (!/^[0-9]{10,11}$/.test(form.SDT.trim())) {
        allErrors.SDT = "Số điện thoại phải có 10-11 chữ số";
      }
      
      // Validate email
      if (!form.email.trim()) {
        allErrors.email = "Email không được để trống";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        allErrors.email = "Email không đúng định dạng";
      } else if (students.some(s => s.email.toLowerCase() === form.email.trim().toLowerCase())) {
        allErrors.email = "Email đã tồn tại";
      }
      
      // Chỉ hiển thị errors cho fields đã touched hoặc khi form đã submitted
      Object.keys(allErrors).forEach(field => {
        if (touched[field] || submitted) {
          visibleErrors[field] = allErrors[field];
        }
      });
    }
    
    return {
      allErrors,
      visibleErrors,
      isValid: Object.keys(allErrors).length === 0,
      hasVisibleErrors: Object.keys(visibleErrors).length > 0,
      shouldShowSummary: submitted && Object.keys(allErrors).length > 0
    };
  }
);

// Selector để thống kê
export const selectStudentStats = createSelector(
  [selectStudents, selectFilteredStudents],
  (allStudents, filteredStudents) => ({
    total: allStudents.length,
    filtered: filteredStudents.length,
    hasData: allStudents.length > 0,
    hasFilteredData: filteredStudents.length > 0
  })
);