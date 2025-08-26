'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  createdAt: string;
  submissions: {
    id: string;
    createdAt: string;
    company: string;
    score: number;
    tier: string;
    painPoints: string[];
    aiReport: string;
    emailedAt: string | null;
    emailStatus: string | null;
  }[];
}

interface Submission {
  id: string;
  createdAt: string;
  user: {
    email: string;
  };
  company: string;
  score: number;
  tier: string;
  painPoints: string[];
  aiReport: string;
  emailedAt: string | null;
  emailStatus: string | null;
}

export default function AdminPage() {
  // Simplified state variables
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isDeletingUsers, setIsDeletingUsers] = useState(false);
  const [isDeletingSubmissions, setIsDeletingSubmissions] = useState(false);
  const [error, setError] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'submissions' | 'users'>('submissions');
  const router = useRouter();

  // Simple authentication check
  const isFullyAuthenticated = isAuthenticated && authToken && !isValidatingToken;

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Validate token before setting as authenticated
      validateTokenAndSetAuth(token);
    } else {
      // No token found, set validation complete
      setIsValidatingToken(false);
    }
  }, []);

  const validateTokenAndSetAuth = async (token: string) => {
    try {
      // Test the token by making a simple API call
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Token is valid, set authentication state
        setAuthToken(token);
        setIsAuthenticated(true);
        // Now fetch data with valid token
        fetchSubmissions(token);
        fetchUsers(token);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('adminToken');
        setAuthToken(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Network error or other issue, remove invalid token
      localStorage.removeItem('adminToken');
      setAuthToken(null);
      setIsAuthenticated(false);
    } finally {
      setIsValidatingToken(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Frontend: Password being sent, length:', password?.length);
    console.log('Frontend: Password value (first 50 chars):', password?.substring(0, 50));

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.token) {
          console.log('Login successful, setting token:', data.token);
          setAuthToken(data.token);
          setIsAuthenticated(true);
          localStorage.setItem('adminToken', data.token);
          // Fetch data immediately after setting authentication state
          console.log('Calling fetchSubmissions with token:', data.token);
          fetchSubmissions(data.token);
          console.log('Calling fetchUsers with token:', data.token);
          fetchUsers(data.token);
        } else {
          setError('Login failed');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubmissions = async (token?: string) => {
    if (!token && !isFullyAuthenticated) {
      console.error('Security violation: Attempted to fetch submissions without authentication');
      return;
    }
    
    const currentToken = token || authToken;
    if (!currentToken) return;
    
    setIsLoadingSubmissions(true);
    setError('');
    try {
      console.log('Fetching submissions...');
      const response = await fetch('/api/admin/submissions', {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });
      console.log('Submissions API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Submissions API response data:', data);
        setSubmissions(data.submissions);
        console.log('Set submissions state:', data.submissions);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Submissions API Error:', errorData);
        if (response.status === 401) {
          // Token expired or invalid
          handleLogout();
          setError('Session expired. Please login again.');
        } else {
          setError(`Failed to fetch submissions: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (err) {
      console.error('Network Error:', err);
      setError('Failed to fetch submissions: Network error');
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const fetchUsers = async (token?: string) => {
    if (!token && !isFullyAuthenticated) {
      console.error('Security violation: Attempted to fetch users without authentication');
      return;
    }
    
    const currentToken = token || authToken;
    if (!currentToken) return;
    
    console.log('fetchUsers - token param:', token ? 'provided' : 'not provided');
    console.log('fetchUsers - authToken:', authToken ? 'set' : 'not set');
    console.log('fetchUsers - currentToken:', currentToken ? 'set' : 'not set');
    
    setIsLoadingUsers(true);
    setError('');
    try {
      console.log('Fetching users...');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });
      console.log('Users API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Users API response data:', data);
        setUsers(data.users);
        console.log('Set users state:', data.users);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Users API Error:', errorData);
        if (response.status === 401) {
          // Token expired or invalid
          handleLogout();
          setError('Session expired. Please login again.');
        } else {
          setError(`Failed to fetch users: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (err) {
      console.error('Network Error:', err);
      setError('Failed to fetch users: Network error');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken(null);
    localStorage.removeItem('adminToken');
    setSubmissions([]);
    setUsers([]);
    setSelectedUsers(new Set());
    setSelectedSubmissions(new Set());
  };

  const handleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSubmissionSelection = (submissionId: string) => {
    const newSelected = new Set(selectedSubmissions);
    if (newSelected.has(submissionId)) {
      newSelected.delete(submissionId);
    } else {
      newSelected.add(submissionId);
    }
    setSelectedSubmissions(newSelected);
  };

  const handleSelectAllSubmissions = () => {
    if (selectedSubmissions.size === submissions.length) {
      setSelectedSubmissions(new Set());
    } else {
      setSelectedSubmissions(new Set(submissions.map(submission => submission.id)));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, userId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleUserSelection(userId);
    }
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(user => user.id)));
    }
  };

  const deleteSelectedUsers = async () => {
    if (!isFullyAuthenticated) {
      console.error('Security violation: Attempted to delete users without authentication');
      return;
    }
    
    if (selectedUsers.size === 0) return;
    
    // Get details about what will be deleted
    const selectedUserDetails = users.filter(u => selectedUsers.has(u.id));
    const totalSubmissions = selectedUserDetails.reduce((sum, user) => sum + user.submissions.length, 0);
    
    const confirmationMessage = `Are you sure you want to delete ${selectedUsers.size} user(s) and ${totalSubmissions} submission(s)?

Users to be deleted:
${selectedUserDetails.map(u => `• ${u.email} (${u.submissions.length} submissions)`).join('\n')}

This action cannot be undone.`;
    
    if (!confirm(confirmationMessage)) {
      return;
    }

    setIsDeletingUsers(true);
    setError('');

    try {
      console.log('Starting deletion of users:', Array.from(selectedUsers));
      
      for (const userId of selectedUsers) {
        const user = users.find(u => u.id === userId);
        if (!user) {
          console.log('User not found for ID:', userId);
          continue;
        }

        console.log('Deleting user:', user.email, 'with submissions:', user.submissions.length);

        // Delete all submissions for this user first
        for (const submission of user.submissions) {
          console.log('Deleting submission:', submission.id);
          const deleteResponse = await fetch(`/api/admin/submissions/${submission.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          
          if (!deleteResponse.ok) {
            const errorText = await deleteResponse.text();
            console.error('Failed to delete submission:', submission.id, errorText);
            throw new Error(`Failed to delete submission ${submission.id}: ${errorText}`);
          }
          console.log('Successfully deleted submission:', submission.id);
        }

        // Delete the user
        console.log('Deleting user:', user.id);
        const response = await fetch('/api/admin/delete-user', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to delete user:', user.email, errorText);
          throw new Error(`Failed to delete user ${user.email}: ${errorText}`);
        }
        console.log('Successfully deleted user:', user.email);
      }
      
      // Refresh data
      console.log('Refreshing data after deletion');
      await fetchSubmissions(authToken || undefined);
      await fetchUsers(authToken || undefined);
      setSelectedUsers(new Set());
      
      console.log('User deletion completed successfully');
      
    } catch (err) {
      console.error('Error deleting users:', err);
      setError(`Failed to delete some users: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsDeletingUsers(false);
    }
  };

  const downloadCSV = () => {
    const submissionsToExport = selectedSubmissions.size > 0 
      ? submissions.filter(submission => selectedSubmissions.has(submission.id))
      : submissions;
    
    if (submissionsToExport.length === 0) return;

    const headers = [
      'Date',
      'Email',
      'Company',
      'Score',
      'Tier',
      'Email Status',
              'Challenges',
      'AI Report'
    ];

    const csvContent = [
      headers.join(','),
      ...submissionsToExport.map(submission => [
        new Date(submission.createdAt).toLocaleDateString(),
        submission.user.email,
        submission.company,
        submission.score,
        submission.tier,
        submission.emailStatus || 'Not sent',
        submission.painPoints.join('; '),
        submission.aiReport.replace(/"/g, '""') // Escape quotes
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const fileName = selectedSubmissions.size > 0 
      ? `ai-readiness-selected-submissions-${selectedSubmissions.size}-${new Date().toISOString().split('T')[0]}.csv`
      : `ai-readiness-all-submissions-${new Date().toISOString().split('T')[0]}.csv`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const sendEmailsToSelected = async () => {
    if (selectedSubmissions.size === 0) return;
    
    const confirmationMessage = `Are you sure you want to send emails to ${selectedSubmissions.size} selected submission(s)?

This will send AI readiness reports to the selected contacts.`;
    
    if (!confirm(confirmationMessage)) {
      return;
    }

    // TODO: Implement email sending logic
    alert(`Email sending functionality will be implemented here. ${selectedSubmissions.size} submissions selected.`);
  };

  const deleteSelectedSubmissions = async () => {
    if (selectedSubmissions.size === 0) return;
    
    // Get details about what will be deleted
    const selectedSubmissionDetails = submissions.filter(submission => selectedSubmissions.has(submission.id));
    
    const confirmationMessage = `Are you sure you want to delete ${selectedSubmissions.size} submission(s)?

Submissions to be deleted:
${selectedSubmissionDetails.map(s => `• ${s.user.email} (${s.company}) - Score: ${s.score}`).join('\n')}

This action cannot be undone.`;
    
    if (!confirm(confirmationMessage)) {
      return;
    }

    setIsDeletingSubmissions(true);
    setError('');

    try {
      console.log('Starting deletion of submissions:', Array.from(selectedSubmissions));
      
      for (const submissionId of selectedSubmissions) {
        const submission = submissions.find(s => s.id === submissionId);
        if (!submission) {
          console.log('Submission not found for ID:', submissionId);
          continue;
        }

        console.log('Deleting submission:', submission.id, 'from', submission.user.email);

        const response = await fetch(`/api/admin/submissions/${submission.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to delete submission:', submission.id, errorText);
          throw new Error(`Failed to delete submission ${submission.id}: ${errorText}`);
        }
        console.log('Successfully deleted submission:', submission.id);
      }
      
      // Refresh data
      console.log('Refreshing data after deletion');
      await fetchSubmissions(authToken || undefined);
      setSelectedSubmissions(new Set());
      
      console.log('Submission deletion completed successfully');
      
    } catch (err) {
      console.error('Error deleting submissions:', err);
      setError(`Failed to delete some submissions: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsDeletingSubmissions(false);
    }
  };

  // Show loading state while validating token
  if (isValidatingToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">Validating session...</h2>
            <p className="text-sm text-gray-600">Please wait while we verify your access</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated || !authToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Access
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter password to access admin panel
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Only render admin content when fully authenticated
  if (!isFullyAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex space-x-3">
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/admin/test-submission', { 
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${authToken}`
                      }
                    });
                    if (response.ok) {
                      alert('Test data created successfully!');
                      fetchSubmissions(authToken || undefined);
                      fetchUsers(authToken || undefined);
                    } else {
                      alert('Failed to create test data');
                    }
                  } catch (err) {
                    alert('Error creating test data');
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                title="Create test data for development"
              >
                Create Test Data
              </button>
              <button
                onClick={() => {
                  fetchSubmissions(authToken || undefined);
                  fetchUsers(authToken || undefined);
                }}
                disabled={isLoadingSubmissions || isLoadingUsers}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoadingSubmissions || isLoadingUsers ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={downloadCSV}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                title={selectedSubmissions.size > 0 ? `Download ${selectedSubmissions.size} selected submissions` : 'Download all submissions'}
              >
                {selectedSubmissions.size > 0 ? `Download CSV (${selectedSubmissions.size})` : 'Download CSV'}
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('submissions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'submissions'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Submissions ({submissions.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users ({users.length})
              </button>
            </nav>
          </div>

          {/* Submissions Tab */}
          {activeTab === 'submissions' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Submissions ({submissions.length})
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      All AI readiness assessment submissions
                    </p>
                    {selectedSubmissions.size > 0 && (
                      <div className="mt-2 text-sm text-indigo-600">
                        <span className="font-medium">{selectedSubmissions.size}</span> submission{selectedSubmissions.size === 1 ? '' : 's'} selected
                      </div>
                    )}
                  </div>
                  {selectedSubmissions.size > 0 && (
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{selectedSubmissions.size}</span> submission{selectedSubmissions.size === 1 ? '' : 's'} selected
                      </div>
                      <button
                        onClick={() => setSelectedSubmissions(new Set())}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      >
                        <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear Selection
                      </button>
                      <button
                        onClick={sendEmailsToSelected}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Send Emails ({selectedSubmissions.size})
                      </button>
                      <button
                        onClick={deleteSelectedSubmissions}
                        disabled={isDeletingSubmissions}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                      >
                        {isDeletingSubmissions ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete ({selectedSubmissions.size})
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {isLoadingSubmissions ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  Loading submissions...
                </div>
              ) : error ? (
                <div className="px-4 py-8 text-center">
                  <div className="text-red-600 mb-4">{error}</div>
                  <button
                    onClick={() => fetchSubmissions(authToken || undefined)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Retry
                  </button>
                </div>
              ) : submissions.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  No submissions found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
                    <p className="text-xs text-gray-500">
                      💡 <strong>Tip:</strong> Use checkboxes to select submissions for email sending or CSV export
                    </p>
                  </div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <input
                              id="select-all-submissions"
                              type="checkbox"
                              checked={selectedSubmissions.size === submissions.length && submissions.length > 0}
                              onChange={handleSelectAllSubmissions}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-2"
                              aria-label="Select all submissions"
                            />
                            <label htmlFor="select-all-submissions" className="sr-only">
                              Select all submissions
                            </label>
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tier
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {submissions.map((submission) => (
                        <tr 
                          key={submission.id} 
                          className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                            selectedSubmissions.has(submission.id) 
                              ? 'bg-indigo-50 border-l-4 border-l-indigo-500' 
                              : ''
                          }`}
                          onClick={() => handleSubmissionSelection(submission.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSubmissionSelection(submission.id);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label={`Select submission from ${submission.user.email} (currently ${selectedSubmissions.has(submission.id) ? 'selected' : 'not selected'})`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <input
                                id={`submission-${submission.id}`}
                                type="checkbox"
                                checked={selectedSubmissions.has(submission.id)}
                                onChange={() => handleSubmissionSelection(submission.id)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-2 hover:border-indigo-400 transition-colors"
                                aria-label={`Select submission from ${submission.user.email}`}
                              />
                              <label htmlFor={`submission-${submission.id}`} className="sr-only">
                                Select submission from {submission.user.email}
                              </label>
                              {selectedSubmissions.has(submission.id) && (
                                <div className="ml-2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {submission.user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {submission.company}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {submission.score}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              submission.tier === 'AI_ENHANCED' ? 'bg-green-100 text-green-800' :
                              submission.tier === 'GETTING_STARTED' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {submission.tier.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {submission.emailStatus || 'Not sent'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Users ({users.length})
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Manage users and their submissions
                    </p>
                    {selectedUsers.size > 0 && (
                      <div className="mt-2 text-sm text-indigo-600">
                        <span className="font-medium">{selectedUsers.size}</span> user{selectedUsers.size === 1 ? '' : 's'} selected for deletion
                      </div>
                    )}
                  </div>
                  {selectedUsers.size > 0 && (
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{selectedUsers.size}</span> user{selectedUsers.size === 1 ? '' : 's'} selected
                      </div>
                      <button
                        onClick={() => setSelectedUsers(new Set())}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      >
                        <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear Selection
                      </button>
                      <button
                        onClick={deleteSelectedUsers}
                        disabled={isDeletingUsers}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                      >
                        {isDeletingUsers ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete {selectedUsers.size} User{selectedUsers.size === 1 ? '' : 's'}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {isLoadingUsers ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  Loading users...
                </div>
              ) : error ? (
                <div className="px-4 py-8 text-center">
                  <div className="text-red-600 mb-4">{error}</div>
                  <button
                    onClick={() => fetchUsers(authToken || undefined)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Retry
                  </button>
                </div>
              ) : users.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  No users found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
                    <p className="text-xs text-gray-500">
                      💡 <strong>Tip:</strong> Click on a row or use the checkbox to select users for deletion
                    </p>
                  </div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <input
                              id="select-all-users"
                              type="checkbox"
                              checked={selectedUsers.size === users.length && users.length > 0}
                              onChange={handleSelectAllUsers}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-2"
                              aria-label="Select all users"
                            />
                            <label htmlFor="select-all-users" className="sr-only">
                              Select all users
                            </label>
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          First Submission
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Submissions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Latest Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Latest Tier
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => {
                        const latestSubmission = user.submissions.sort((a, b) => 
                          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        )[0];
                        
                        return (
                          <tr 
                            key={user.id} 
                            className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                              selectedUsers.has(user.id) 
                                ? 'bg-indigo-50 border-l-4 border-l-indigo-500' 
                                : ''
                            }`}
                            onClick={() => handleUserSelection(user.id)}
                            onKeyDown={(e) => handleKeyDown(e, user.id)}
                            tabIndex={0}
                            role="button"
                            aria-label={`Select ${user.email} (currently ${selectedUsers.has(user.id) ? 'selected' : 'not selected'})`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <input
                                  id={`user-${user.id}`}
                                  type="checkbox"
                                  checked={selectedUsers.has(user.id)}
                                  onChange={() => handleUserSelection(user.id)}
                                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-2 hover:border-indigo-400 transition-colors"
                                  aria-label={`Select user ${user.email}`}
                                />
                                <label htmlFor={`user-${user.id}`} className="sr-only">
                                  Select {user.email}
                                </label>
                                {selectedUsers.has(user.id) && (
                                  <div className="ml-2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.submissions.length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {latestSubmission ? latestSubmission.score : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {latestSubmission ? (
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  latestSubmission.tier === 'AI_ENHANCED' ? 'bg-green-100 text-green-800' :
                                  latestSubmission.tier === 'GETTING_STARTED' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {latestSubmission.tier.replace(/_/g, ' ')}
                                </span>
                              ) : 'N/A'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
