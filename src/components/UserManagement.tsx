
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Users, Shield } from 'lucide-react';

interface RegularUser {
  id: string;
  username: string;
  email: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface UserManagementProps {
  adminId: string;
}

const UserManagement = ({ adminId }: UserManagementProps) => {
  const [users, setUsers] = useState<RegularUser[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('viewer');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<RegularUser | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('regular_users')
        .select('id, username, email, role, is_active, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createUser = async () => {
    if (!newUsername.trim() || !newPassword.trim()) {
      toast({
        title: "Missing information",
        description: "Username and password are required.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('regular_users')
        .insert([{
          username: newUsername.trim(),
          password_hash: await hashPassword(newPassword),
          email: newEmail.trim() || null,
          role: newRole,
          created_by: adminId
        }]);

      if (error) throw error;

      setNewUsername('');
      setNewPassword('');
      setNewEmail('');
      setNewRole('viewer');
      setShowCreateForm(false);
      fetchUsers();

      toast({
        title: "User created",
        description: `User "${newUsername}" has been created successfully with ${newRole} role.`
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error.message?.includes('duplicate') 
          ? "Username already exists. Please choose a different username."
          : "Failed to create user.",
        variant: "destructive"
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: string, username: string) => {
    try {
      const { error } = await supabase
        .from('regular_users')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      fetchUsers();
      toast({
        title: "Role updated",
        description: `User "${username}" role has been updated to ${newRole}.`
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive"
      });
    }
  };

  const deleteUser = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This will also delete all their data.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('regular_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      fetchUsers();
      toast({
        title: "User deleted",
        description: `User "${username}" has been deleted successfully.`
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive"
      });
    }
  };

  const hashPassword = async (password: string): Promise<string> => {
    const { data, error } = await supabase.rpc('hash_password', { password });
    if (error) throw error;
    return data;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'analyst': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin': return 'Full access to all features';
      case 'analyst': return 'Can manage brands and search strings';
      case 'viewer': return 'Can only view and search';
      default: return 'Unknown role';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-blue-500 mr-3" />
            <CardTitle>User Management</CardTitle>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showCreateForm && (
          <div className="mb-6 p-4 bg-green-50 rounded-2xl border">
            <h3 className="font-semibold text-gray-800 mb-4">Create New User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer - {getRoleDescription('viewer')}</SelectItem>
                    <SelectItem value="analyst">Analyst - {getRoleDescription('analyst')}</SelectItem>
                    <SelectItem value="admin">Admin - {getRoleDescription('admin')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={createUser}>
                  Create User
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewUsername('');
                    setNewPassword('');
                    setNewEmail('');
                    setNewRole('viewer');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Existing Users ({users.length})</h3>
          
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No users created yet. Create your first user to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-800">
                          {user.username}
                        </h4>
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3 text-gray-500" />
                          <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                            {user.role.toUpperCase()}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {user.email && (
                        <p className="text-sm text-gray-600">{user.email}</p>
                      )}
                      <p className="text-xs text-gray-500 mb-2">
                        {getRoleDescription(user.role)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={user.role}
                        onValueChange={(newRole) => updateUserRole(user.id, newRole, user.username)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="analyst">Analyst</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteUser(user.id, user.username)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
