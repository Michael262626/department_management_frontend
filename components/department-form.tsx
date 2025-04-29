"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Department } from "@/lib/types";
import { addDepartment, updateDepartment, setIsModalOpen } from "@/store/departmentSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";

export function DepartmentForm() {
  const { editingDepartment, departments, formSuccess, loading } = useSelector((state: any) => state.departments);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [name, setName] = useState("");
  const [subDepartments, setSubDepartments] = useState<{ name: string }[]>([{ name: "" }]);

  useEffect(() => {
    if (editingDepartment) {
      setName(editingDepartment.name);
      setSubDepartments(editingDepartment.subDepartments?.length ? editingDepartment.subDepartments : [{ name: "" }]);
    } else {
      setName("");
      setSubDepartments([{ name: "" }]);
    }
  }, [editingDepartment]);

  const handleSubDepartmentChange = (index: number, value: string) => {
    const newSubDepartments = [...subDepartments];
    newSubDepartments[index].name = value;
    setSubDepartments(newSubDepartments);
  };

  const handleAddSubDepartment = () => {
    setSubDepartments([...subDepartments, { name: "" }]);
  };

  const handleRemoveSubDepartment = (index: number) => {
    if (subDepartments.length > 1) {
      const newSubDepartments = subDepartments.filter((_, i) => i !== index);
      setSubDepartments(newSubDepartments);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Filter out empty sub-department names and prepare department data
      const validSubDepartments = subDepartments.filter((subDept) => subDept.name.trim() !== "");
      const departmentData: Partial<Department> = {
        name,
        subDepartments: validSubDepartments.length > 0 ? validSubDepartments : [],
      };

      if (editingDepartment) {
        await dispatch(updateDepartment({ id: editingDepartment.id, departmentData }));

      } else {
        await dispatch(addDepartment(departmentData));
      }

      setTimeout(() => {
        setName("");
        setSubDepartments([{ name: "" }]);
        dispatch(setIsModalOpen(false));
        router.push("/dashboard/departments");
      }, 1500);
    } catch (error) {
      console.error("Error saving department:", error);
    }
  };

  const handleCancel = () => {
    setName("");
    setSubDepartments([{ name: "" }]);
    router.push("/dashboard/departments");
  };

  return (
    <Card className="gradient-card border-purple-800/50 shadow-lg max-w-2xl mx-auto">
      <CardHeader className="border-b border-purple-900/50 bg-purple-900/20">
        <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-white">
          {editingDepartment ? "Edit Department" : "Create Department"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {formSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xl font-medium text-white">
              Department {editingDepartment ? "updated" : "created"} successfully!
            </p>
            <p className="text-gray-400">Redirecting to departments list...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Department Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter department name"
                required
                className="bg-gray-900/50 border-purple-800/50 focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Sub-departments (Optional)</Label>
              {subDepartments.map((subDept, index) => (
                <div key={index} className="flex space-x-2 items-center">
                  <Input
                    type="text"
                    value={subDept.name}
                    onChange={(e) => handleSubDepartmentChange(index, e.target.value)}
                    placeholder={`Sub-department ${index + 1}`}
                    className="bg-gray-900/50 border-purple-800/50 focus:border-purple-500"
                  />
                  {subDepartments.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemoveSubDepartment(index)}
                      className="h-10"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddSubDepartment}
                className="border-purple-700 hover:bg-purple-900/30 mt-2"
              >
                Add Sub-department
              </Button>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-purple-700 hover:bg-purple-900/30"
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" disabled={loading} className="gradient-button">
                <Check className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : editingDepartment ? "Update Department" : "Create Department"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}