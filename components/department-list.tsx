"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchDepartments, deleteDepartment, setIsModalOpen, setEditingDepartment } from "@/store/departmentSlice";
import { DepartmentForm } from "./department-form";
import { Department } from "@/lib/types";

export function DepartmentList() {
  const { departments, isModalOpen, loading, error } = useSelector((state: any) => state.departments);
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedDepartments, setPaginatedDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch departments on component mount
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    // Filter departments based on search term
    const filteredDepartments = departments.filter((dept: Department) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate total pages
    const total = Math.ceil(filteredDepartments.length / pageSize);
    setTotalPages(total || 1);

    // Get current page data
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedDepartments(filteredDepartments.slice(startIndex, endIndex));
  }, [departments, currentPage, pageSize, searchTerm]);

  const handleEdit = (department: Department) => {
    dispatch(setEditingDepartment(department));
    dispatch(setIsModalOpen(true));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      dispatch(deleteDepartment(id));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="gradient-card border-purple-800/50 shadow-lg">
      <CardHeader className="border-b border-purple-900/50 bg-purple-900/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle>All Departments</CardTitle>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900/50 border-purple-800/50 focus:border-purple-500"
          />
        </div>
        <Button onClick={() => dispatch(setIsModalOpen(true))} className="gradient-button">
          Create Department
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading departments...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-400">Error: {error}</div>
        ) : (
          <>
            <div className="rounded-md border border-purple-900/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-purple-900/20">
                  <TableRow className="hover:bg-purple-900/30 border-purple-900/50">
                    <TableHead className="text-purple-300">ID</TableHead>
                    <TableHead className="text-purple-300">Name</TableHead>
                    <TableHead className="text-purple-300">Sub-departments</TableHead>
                    <TableHead className="text-purple-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDepartments.length > 0 ? (
                    paginatedDepartments.map((department) => (
                      <TableRow key={department.id} className="hover:bg-purple-900/30 border-purple-900/50">
                        <TableCell className="font-medium text-gray-300">
                            {department.id.toString().slice(0, 8)}...
                        </TableCell>
                        <TableCell className="text-white">{department.name}</TableCell>
                        <TableCell className="text-gray-300">
                          {department.subDepartments?.length
                            ? department.subDepartments.map((sub) => sub.name).join(", ")
                            : "None"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(department)}
                              className="border-purple-700 hover:bg-purple-900/50 hover:text-purple-300"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(department.id)}
                              className="border-red-900/50 hover:bg-red-900/30 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="hover:bg-purple-900/30 border-purple-900/50">
                      <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                        {searchTerm
                          ? "No departments match your search"
                          : "No departments found. Create one to get started."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {departments.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Showing {paginatedDepartments.length} of {departments.length} departments
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={`${
                          currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                        } hover:bg-purple-900/30 border-purple-800/50`}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={page === currentPage}
                          className={`cursor-pointer ${
                            page === currentPage ? "bg-purple-900 text-white" : "hover:bg-purple-900/30 border-purple-800/50"
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={`${
                          currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                        } hover:bg-purple-900/30 border-purple-800/50`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-gray-800 rounded-lg p-8 relative max-w-2xl w-full">
              <DepartmentForm />
              <Button
                onClick={() => dispatch(setIsModalOpen(false))}
                className="absolute top-4 right-4 text-white hover:bg-red-900/50"
                variant="ghost"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}