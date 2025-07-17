import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  students: [
    {
      id: nanoid(),
      maSV: "SV001",
      hoVaTen: "Nguyễn Văn A",
      SDT: "0123456789",
      email: "nguyenvana@email.com"
    },
    {
      id: nanoid(),
      maSV: "SV002", 
      hoVaTen: "Trần Thị B",
      SDT: "0987654321",
      email: "tranthib@email.com"
    }
  ],
  form: {
    maSV: '',
    hoVaTen: '',
    SDT: '',
    email: ''
  },
  formTouched: {
    maSV: false,
    hoVaTen: false,
    SDT: false,
    email: false
  },
  formSubmitted: false,
  filter: '',
  loading: false,
  error: null
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    addStudent: (state, action) => {
      const newStudent = {
        id: nanoid(),
        ...action.payload,
        maSV: action.payload.maSV.trim(),
        hoVaTen: action.payload.hoVaTen.trim(),
        SDT: action.payload.SDT.trim(),
        email: action.payload.email.trim()
      };
      state.students.push(newStudent);
    },
    
    deleteStudent: (state, action) => {
      state.students = state.students.filter(student => student.id !== action.payload);
    },
    
    updateStudent: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.students.findIndex(student => student.id === id);
      if (index !== -1) {
        state.students[index] = { ...state.students[index], ...updates };
      }
    },
    
    updateForm: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },
    
    setFieldTouched: (state, action) => {
      const { field, touched } = action.payload;
      state.formTouched[field] = touched;
    },
    
    setFormSubmitted: (state, action) => {
      state.formSubmitted = action.payload;
    },
    
    resetForm: (state) => {
      state.form = {
        maSV: '',
        hoVaTen: '',
        SDT: '',
        email: ''
      };
      state.formTouched = {
        maSV: false,
        hoVaTen: false,
        SDT: false,
        email: false
      };
      state.formSubmitted = false;
      state.error = null;
    },
    
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
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
} = studentSlice.actions;

export default studentSlice.reducer;