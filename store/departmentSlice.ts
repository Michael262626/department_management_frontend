import { Department } from '@/lib/types';
import Cookies from "js-cookie";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface DepartmentState {
  departments: Department[];
  loading: boolean;
  error: string | null;
  formSuccess: boolean;
  isModalOpen: boolean;
  editingDepartment: Department | null;
}

const initialState: DepartmentState = {
  departments: [],
  loading: false,
  error: null,
  formSuccess: false,
  isModalOpen: false,
  editingDepartment: null,
};

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql';

export const fetchDepartments = createAsyncThunk<Department[], void, { rejectValue: string }>(
  'departments/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken')
      const response = await axios.post(
        GRAPHQL_ENDPOINT,
        {
          query: `
            query {
              getDepartments {
                id
                name
                subDepartments {
                  id
                  name
                }
              }
            }
          `,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
          timeout: 5000, // 5-second timeout
        }
      );

      console.log('GraphQL Response:', JSON.stringify(response.data, null, 2));

      if (response.data.errors) {
        const errorMessage = response.data.errors[0]?.message || 'Failed to fetch departments';
        console.error('GraphQL Errors:', response.data.errors);
        return rejectWithValue(errorMessage);
      }

      if (!response.data.data?.getDepartments) {
        return rejectWithValue('No departments found in response');
      }

      return response.data.data.getDepartments;
    } catch (error: any) {
      console.error('Fetch Departments Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.response?.data?.errors?.[0]?.message ||
        error.message ||
        'Network error while fetching departments';
      return rejectWithValue(errorMessage);
    }
  }
);

export const addDepartment = createAsyncThunk<Department, Partial<Department>, { rejectValue: string }>(
  'departments/add',
  async (departmentData, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.post(
        GRAPHQL_ENDPOINT,
        {
          query: `
            mutation CreateDepartment($input: CreateDepartmentInput!) {
              createDepartment(input: $input) {
                id
                name
                subDepartments {
                  name
                }
              }
            }
          `,
          variables: {
            input: {
              name: departmentData.name,
              subDepartments: departmentData.subDepartments?.map(({ name }) => ({ name })) || [],
            },
          },
        },
        {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
          timeout: 5000,
        }
      );

      if (response.data.errors) {
        return rejectWithValue(response.data.errors[0]?.message || 'Failed to create department');
      }

      return response.data.data.createDepartment;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message ||
        error.message ||
        'Network error while creating department';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateDepartment = createAsyncThunk<
  Department,
  { id: string; departmentData: Partial<Department> },
  { rejectValue: string }
>(
  'departments/update',
  async ({ id, departmentData }, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.post(
        GRAPHQL_ENDPOINT,
        {
          query: `
            mutation UpdateDepartment($id: Int!, $input: UpdateDepartmentInput!) {
                updateDepartment(id: $id, input: $input) {
                    name
                    subDepartments {
                        name
                    }
                }
            }
          `,
          variables: {
            id,
            input: {
                name: departmentData.name,
                subDepartments: departmentData.subDepartments?.map(sd => ({
                  name: sd.name
                })) || [],
              }              
          },
        },
        {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
          timeout: 5000,
        }
      );

      if (response.data.errors) {
        return rejectWithValue(response.data.errors[0]?.message || 'Failed to update department');
      }

      return response.data.data.updateDepartment;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message ||
        error.message ||
        'Network error while updating department';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteDepartment = createAsyncThunk<number, number, { rejectValue: string }>(
  'departments/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.post(
        GRAPHQL_ENDPOINT,
        {
          query: `
            mutation DeleteDepartment($id: Int!) {
              deleteDepartment(id: $id)
            }
          `,
          variables: { id },
        },
        {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          timeout: 5000,
        }
      );

      if (response.data.errors) {
        return rejectWithValue(response.data.errors[0]?.message || 'Failed to delete department');
      }

      return id;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message ||
        error.message ||
        'Network error while deleting department';
      return rejectWithValue(errorMessage);
    }
  }
);

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    setIsModalOpen(state, action) {
      state.isModalOpen = action.payload;
    },
    setFormSuccess(state, action) {
      state.formSuccess = action.payload;
    },
    clearDepartmentState(state) {
      state.error = null;
      state.formSuccess = false;
    },
    setEditingDepartment(state, action) {
      state.editingDepartment = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch departments';
      })
      .addCase(addDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.formSuccess = false;
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.formSuccess = true;
        state.departments.push(action.payload);
      })
      .addCase(addDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create department';
      })
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.formSuccess = false;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.formSuccess = true;
        state.departments = state.departments.map((dept) =>
          dept.id === action.payload.id ? action.payload : dept
        );
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update department';
      })
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = state.departments.filter((dept) => dept.id !== action.payload);
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete department';
      });
  },
});

export const { setIsModalOpen, setFormSuccess, clearDepartmentState, setEditingDepartment, clearError } = departmentSlice.actions;
export default departmentSlice.reducer;