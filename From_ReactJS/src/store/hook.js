// store/hooks.js - Final Fixed Version (NO external imports)
import React from "react";
import { useSelector, useDispatch } from "react-redux";

// ✅ ALL IMPORTS từ studentSlice.js
import { 
  addStudent, 
  deleteStudent, 
  updateStudent, 
  updateForm, 
  setFieldTouched,
  setFormSubmitted,
  resetForm, 
  setFilter,
  setLoading,
  setError,
  clearError
} from "./studentSlice";

// ✅ INLINE SELECTORS (không import từ file khác)
const selectForm = (state) => state.student.form;
const selectFormTouched = (state) => state.student.formTouched;
const selectFormSubmitted = (state) => state.student.formSubmitted;
const selectStudents = (state) => state.student.students;
const selectFilter = (state) => state.student.filter;

// ✅ SMART SEARCH SELECTOR
const selectFilteredStudents = (state) => {
  const students = state.student.students;
  const filter = state.student.filter;
  
  if (!filter || !filter.trim()) return students;
  
  // Normalize function for smart search
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };
  
  const normalizedFilter = normalizeText(filter);
  
  return students.filter(student => {
    const nameMatch = normalizeText(student.hoVaTen).includes(normalizedFilter);
    const idMatch = normalizeText(student.maSV).includes(normalizedFilter);
    const emailMatch = normalizeText(student.email).includes(normalizedFilter);
    const phoneMatch = normalizeText(student.SDT).includes(normalizedFilter);
    
    return nameMatch || idMatch || emailMatch || phoneMatch;
  });
};

// ✅ VALIDATION FUNCTIONS
const validateField = (name, value, students) => {
  if (!value || typeof value !== 'string') {
    return `${name} không được để trống`;
  }

  const trimmedValue = value.trim();
  
  switch (name) {
    case 'maSV':
      if (!trimmedValue) return 'Mã sinh viên không được để trống';
      if (trimmedValue.length < 6) return 'Mã sinh viên phải có ít nhất 6 ký tự';
      if (students.some(s => s.maSV.toLowerCase() === trimmedValue.toLowerCase())) {
        return 'Mã sinh viên đã tồn tại';
      }
      return null;
      
    case 'hoVaTen':
      if (!trimmedValue) return 'Họ và tên không được để trống';
      if (trimmedValue.length < 2) return 'Họ và tên phải có ít nhất 2 ký tự';
      return null;
      
    case 'SDT':
      if (!trimmedValue) return 'Số điện thoại không được để trống';
      if (!/^[0-9]{10,11}$/.test(trimmedValue)) return 'Số điện thoại phải có 10-11 chữ số';
      return null;
      
    case 'email':
      if (!trimmedValue) return 'Email không được để trống';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) return 'Email không đúng định dạng';
      if (students.some(s => s.email.toLowerCase() === trimmedValue.toLowerCase())) {
        return 'Email đã tồn tại';
      }
      return null;
      
    default:
      return null;
  }
};

// ✅ STUDENT ACTIONS HOOK
export const useStudentActions = () => {
  const dispatch = useDispatch();

  return {
    addStudent: (studentData) => dispatch(addStudent(studentData)),
    deleteStudent: (id) => dispatch(deleteStudent(id)),
    updateStudent: (id, updates) => dispatch(updateStudent({ id, updates })),
    updateForm: (field, value) => dispatch(updateForm({ field, value })),
    setFieldTouched: (field, touched = true) => dispatch(setFieldTouched({ field, touched })),
    setFormSubmitted: (submitted = true) => dispatch(setFormSubmitted(submitted)),
    resetForm: () => dispatch(resetForm()),
    setFilter: (filter) => dispatch(setFilter(filter)),
    setLoading: (loading) => dispatch(setLoading(loading)),
    setError: (error) => dispatch(setError(error)),
    clearError: () => dispatch(clearError())
  };
};

// ✅ STUDENT DATA HOOK
export const useStudentData = () => {
  const students = useSelector(selectStudents);
  const filteredStudents = useSelector(selectFilteredStudents);
  
  return {
    students,
    form: useSelector(selectForm),
    formTouched: useSelector(selectFormTouched),
    formSubmitted: useSelector(selectFormSubmitted),
    filter: useSelector(selectFilter),
    filteredStudents,
    studentCount: students.length,
    filteredStudentCount: filteredStudents.length,
    stats: {
      total: students.length,
      filtered: filteredStudents.length,
      hasData: students.length > 0,
      hasFilteredData: filteredStudents.length > 0
    }
  };
};

// ✅ STUDENT FORM HOOK (với validation thông minh)
export const useStudentForm = () => {
  const form = useSelector(selectForm);
  const formTouched = useSelector(selectFormTouched);
  const formSubmitted = useSelector(selectFormSubmitted);
  const students = useSelector(selectStudents);
  const actions = useStudentActions();

  // Field validation function
  const getFieldValidation = (fieldName) => {
    const value = form[fieldName] || '';
    const isTouched = formTouched[fieldName];
    const shouldShowError = isTouched || formSubmitted;
    
    const error = validateField(fieldName, value, students);
    const isValid = !error && value.trim().length > 0;
    
    return {
      error: shouldShowError ? error : null,
      isValid: shouldShowError ? isValid : false,
      hasValue: value.trim().length > 0,
      isTouched,
      shouldShowError
    };
  };

  // Overall form validation
  const getFormValidation = () => {
    const allErrors = {};
    const visibleErrors = {};
    
    Object.keys(form).forEach(field => {
      const error = validateField(field, form[field], students);
      if (error) {
        allErrors[field] = error;
        if (formTouched[field] || formSubmitted) {
          visibleErrors[field] = error;
        }
      }
    });
    
    return {
      allErrors,
      visibleErrors,
      isValid: Object.keys(allErrors).length === 0,
      hasVisibleErrors: Object.keys(visibleErrors).length > 0,
      shouldShowSummary: formSubmitted && Object.keys(allErrors).length > 0
    };
  };

  // Event handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    actions.setFormSubmitted(true);
    actions.clearError();
    
    const validation = getFormValidation();
    
    if (validation.isValid) {
      try {
        actions.addStudent(form);
        actions.resetForm();
        return { success: true, message: "Thêm sinh viên thành công!" };
      } catch (error) {
        actions.setError("Có lỗi xảy ra khi thêm sinh viên");
        return { success: false, message: "Có lỗi xảy ra khi thêm sinh viên" };
      }
    } else {
      const firstError = Object.values(validation.allErrors)[0];
      actions.setError(firstError);
      return { success: false, message: firstError };
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    actions.updateForm(name, value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    actions.setFieldTouched(name, true);
  };

  const handleFocus = () => {
    actions.clearError();
  };

  return {
    form,
    formTouched,
    formSubmitted,
    validation: getFormValidation(),
    handleSubmit,
    handleChange,
    handleBlur,
    handleFocus,
    resetForm: actions.resetForm,
    getFieldValidation
  };
};

// ✅ STUDENT TABLE HOOK (với debounce search)
export const useStudentTable = () => {
  const filteredStudents = useSelector(selectFilteredStudents);
  const filter = useSelector(selectFilter);
  const stats = useSelector(state => {
    const total = state.student.students.length;
    const filtered = filteredStudents.length;
    return {
      total,
      filtered,
      hasData: total > 0,
      hasFilteredData: filtered > 0
    };
  });
  
  const { deleteStudent, setFilter } = useStudentActions();
  
  // Local search input state for debouncing
  const [searchInput, setSearchInput] = React.useState(filter);
  
  // Debounce search to improve performance
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilter(searchInput);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchInput, setFilter]);
  
  // Sync with external filter changes
  React.useEffect(() => {
    setSearchInput(filter);
  }, [filter]);

  // Event handlers
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sinh viên này?")) {
      deleteStudent(id);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchInput(searchTerm);
  };
  
  const clearSearch = () => {
    setSearchInput('');
    setFilter('');
  };

  return {
    students: filteredStudents,
    filter,
    searchInput,
    stats,
    handleDelete,
    handleSearch,
    clearSearch
  };
};

// ✅ COMBINED HOOK (tổng hợp)
export const useStudent = () => {
  const data = useStudentData();
  const actions = useStudentActions();
  return { ...data, ...actions };
};