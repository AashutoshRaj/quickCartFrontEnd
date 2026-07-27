/**
 * Employee API Service
 * Handles all staff Employee management API calls for the admin panel
 */

import apiClient from '../admin-auth/api';

export type EmployeeRole = 'Admin' | 'Manager' | 'Cashier' | 'Inventory Staff';
export type EmployeeStatus = 'Active' | 'On Leave' | 'Inactive';

export interface Employee {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  photo?: string | null;
  role: EmployeeRole;
  email: string;
  phone: string;
  storeId: string;
  joiningDate: string;
  status: EmployeeStatus;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeePayload {
  firstName: string;
  lastName: string;
  role: EmployeeRole;
  email: string;
  phone: string;
  joiningDate?: string;
  photo?: string | null;
  status?: EmployeeStatus;
}

export interface EmployeeListFilters {
  search?: string;
  role?: string;
  status?: string;
  sort?: 'newest' | 'employeeId' | 'name';
}

/**
 * List employees for the admin's store, with search/filter/sort
 */
export const getEmployees = async (
  filters: EmployeeListFilters = {}
): Promise<{ employees: Employee[]; results: number }> => {
  try {
    const response = await apiClient.get('/employees', { params: filters });
    return { employees: response.data.data.employees, results: response.data.results };
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

/**
 * Fetch a single employee by ID
 */
export const getEmployee = async (id: string): Promise<Employee> => {
  try {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data.data.employee;
  } catch (error) {
    console.error('Error fetching employee:', error);
    throw error;
  }
};

/**
 * Create a new employee account; returns the employee plus a
 * one-time plaintext temporary password to share with them
 */
export const createEmployee = async (
  payload: CreateEmployeePayload
): Promise<{ employee: Employee; tempPassword: string }> => {
  try {
    const response = await apiClient.post('/employees', payload);
    return response.data.data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

/**
 * Update an existing employee's profile fields
 */
export const updateEmployee = async (
  id: string,
  payload: Partial<CreateEmployeePayload>
): Promise<Employee> => {
  try {
    const response = await apiClient.patch(`/employees/${id}`, payload);
    return response.data.data.employee;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

/**
 * Update an employee's status (Active / On Leave / Inactive)
 */
export const setEmployeeStatus = async (id: string, status: EmployeeStatus): Promise<Employee> => {
  try {
    const response = await apiClient.patch(`/employees/${id}/status`, { status });
    return response.data.data.employee;
  } catch (error) {
    console.error('Error updating employee status:', error);
    throw error;
  }
};

/**
 * Reset an employee's password; returns the new one-time plaintext password
 */
export const resetEmployeePassword = async (id: string): Promise<{ tempPassword: string }> => {
  try {
    const response = await apiClient.patch(`/employees/${id}/reset-password`);
    return response.data.data;
  } catch (error) {
    console.error('Error resetting employee password:', error);
    throw error;
  }
};

/**
 * Permanently delete an employee account
 */
export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/employees/${id}`);
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

/**
 * Send an employee's credentials via email or SMS
 */
export const sendEmployeeCredentials = async (
  id: string,
  method: 'email' | 'sms',
  tempPassword: string
): Promise<void> => {
  try {
    await apiClient.post(`/employees/${id}/send-credentials`, { method, tempPassword });
  } catch (error) {
    console.error(`Error sending employee credentials via ${method}:`, error);
    throw error;
  }
};
