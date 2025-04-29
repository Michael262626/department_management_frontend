export interface Department {
  id: number
  name: string
  subDepartments?: { name: string }[];
  parentId: number | null
}
