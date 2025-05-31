import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  UserPlus, 
  Users, 
  Shield, 
  Award, 
  Settings,
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define custom user roles with permissions
const userRoles = [
  {
    id: "compounding_specialist",
    name: "Compounding Specialist",
    description: "Advanced formula access and creation",
    permissions: [
      "view_all_formulas",
      "create_formulas",
      "edit_formulas",
      "manage_compounding_procedures",
      "access_usp_795_797_800",
      "quality_control"
    ],
    icon: <Award className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-800"
  },
  {
    id: "compliance_officer",
    name: "Compliance Officer",
    description: "USP standards and regulatory reporting",
    permissions: [
      "view_compliance_reports",
      "create_compliance_reports",
      "manage_audits",
      "access_all_usp_chapters",
      "regulatory_reporting",
      "risk_assessment"
    ],
    icon: <Shield className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: "training_coordinator",
    name: "Training Coordinator",
    description: "Staff training and certification management",
    permissions: [
      "manage_training_programs",
      "track_certifications",
      "create_training_materials",
      "schedule_training",
      "competency_assessment"
    ],
    icon: <Users className="h-4 w-4" />,
    color: "bg-green-100 text-green-800"
  },
  {
    id: "department_supervisor",
    name: "Department Supervisor",
    description: "Oversee specific pharmacy departments",
    permissions: [
      "manage_department_tasks",
      "view_department_reports",
      "approve_procedures",
      "staff_oversight",
      "resource_management"
    ],
    icon: <Settings className="h-4 w-4" />,
    color: "bg-orange-100 text-orange-800"
  },
  {
    id: "pharmacist",
    name: "Staff Pharmacist",
    description: "General pharmacy operations and compliance",
    permissions: [
      "view_formulas",
      "basic_compliance_access",
      "task_management",
      "document_access",
      "patient_consultation"
    ],
    icon: <Users className="h-4 w-4" />,
    color: "bg-teal-100 text-teal-800"
  },
  {
    id: "admin",
    name: "System Administrator",
    description: "Full system access and user management",
    permissions: [
      "full_system_access",
      "user_management",
      "system_configuration",
      "data_management",
      "security_settings"
    ],
    icon: <Shield className="h-4 w-4" />,
    color: "bg-red-100 text-red-800"
  }
];

const departments = [
  { id: "sterile", name: "Sterile Compounding (USP 797)" },
  { id: "non_sterile", name: "Non-sterile Compounding (USP 795)" },
  { id: "hazardous", name: "Hazardous Drug Handling (USP 800)" },
  { id: "quality_assurance", name: "Quality Assurance" },
  { id: "administration", name: "Administration" }
];

export default function UserManagement() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      username: "sjohnson",
      email: "sarah.johnson@pharmacy.com",
      role: "compliance_officer",
      department: "quality_assurance",
      isActive: true,
      lastLogin: "2024-01-15",
      certifications: ["PharmD", "USP Compliance Certification"]
    },
    {
      id: 2,
      name: "Mike Chen",
      username: "mchen",
      email: "mike.chen@pharmacy.com",
      role: "compounding_specialist",
      department: "sterile",
      isActive: true,
      lastLogin: "2024-01-14",
      certifications: ["PharmD", "Sterile Compounding Certificate"]
    }
  ]);
  
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    email: "",
    role: "",
    department: "",
    password: ""
  });
  
  const { toast } = useToast();

  const handleAddUser = () => {
    if (!newUser.name || !newUser.username || !newUser.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const user = {
      id: users.length + 1,
      ...newUser,
      isActive: true,
      lastLogin: "Never",
      certifications: []
    };

    setUsers([...users, user]);
    setNewUser({ name: "", username: "", email: "", role: "", department: "", password: "" });
    setIsAddUserOpen(false);
    
    toast({
      title: "User Added",
      description: `${newUser.name} has been added with ${userRoles.find(r => r.id === newUser.role)?.name} role`
    });
  };

  const getRoleInfo = (roleId: string) => {
    return userRoles.find(role => role.id === roleId);
  };

  const getDepartmentName = (deptId: string) => {
    return departments.find(dept => dept.id === deptId)?.name || deptId;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">Manage pharmacy team members and their access permissions</p>
        </div>
        
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  placeholder="Enter username"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {userRoles.map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center">
                          {role.icon}
                          <span className="ml-2">{role.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={newUser.department} onValueChange={(value) => setNewUser({...newUser, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="password">Temporary Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Enter temporary password"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddUser} className="flex-1">
                  Add User
                </Button>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userRoles.map(role => (
          <Card key={role.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {role.icon}
                  <CardTitle className="text-sm ml-2">{role.name}</CardTitle>
                </div>
                <Badge className={role.color}>
                  {users.filter(u => u.role === role.id).length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{role.description}</p>
              <div className="text-xs text-gray-500">
                {role.permissions.slice(0, 3).join(", ")}
                {role.permissions.length > 3 && "..."}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map(user => {
              const roleInfo = getRoleInfo(user.role);
              return (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge className={roleInfo?.color}>
                        {roleInfo?.name}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {getDepartmentName(user.department)}
                      </p>
                      <p className="text-xs text-gray-400">
                        Last login: {user.lastLogin}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}