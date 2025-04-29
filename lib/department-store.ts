"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import type { Department } from "./types"

interface DepartmentState {
  departments: Department[]
  editingDepartment: Department | null
  addDepartment: (department: Partial<Department>) => Promise<Department>
  updateDepartment: (id: Number, department: Partial<Department>) => Promise<Department>
  removeDepartment: (id: Number) => void
  setEditingDepartment: (department: Department | null) => void
}

export const useDepartmentStore = create<DepartmentState>()(
  persist(
    (set, get) => ({
      departments: [],
      editingDepartment: null,

      addDepartment: async (departmentData) => {
        const newDepartment: Department = {
          id: Math.floor(Math.random() * 1000000),
          name: departmentData.name || "Unnamed Department",
          parentId: departmentData.parentId || null,
        }

        set((state) => ({
          departments: [...state.departments, newDepartment],
        }))

        return newDepartment
      },

      updateDepartment: async (id, departmentData) => {
        const { departments } = get()
        const departmentIndex = departments.findIndex((d) => d.id === id);

        if (departmentIndex === -1) {
          throw new Error(`Department with ID ${id} not found`)
        }

        const updatedDepartment = {
          ...departments[departmentIndex],
          ...departmentData,
        }

        const updatedDepartments = [...departments]
        updatedDepartments[departmentIndex] = updatedDepartment

        set({
          departments: updatedDepartments,
          editingDepartment: null,
        })

        return updatedDepartment
      },

      removeDepartment: (id) => {
        set((state) => ({
          departments: state.departments.filter((d) => d.id !== id),
        }))

        // Also update any departments that had this as a parent
        set((state) => ({
          departments: state.departments.map((d) => (d.parentId === id ? { ...d, parentId: null } : d)),
        }))
      },

      setEditingDepartment: (department) => {
        set({ editingDepartment: department })
      },
    }),
    {
      name: "department-storage",
    },
  ),
)
