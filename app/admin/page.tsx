"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Document {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function AdminPanel() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [regenerating, setRegenerating] = useState(false);

  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Check for session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchDocuments();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchDocuments();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/admin/documents");
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  // Add new document
  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Document added successfully!");
        setTitle("");
        setContent("");
        fetchDocuments();
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Failed to add document");
    } finally {
      setLoading(false);
    }
  };

  // Regenerate all embeddings
  const handleRegenerateEmbeddings = async () => {
    if (!confirm("This will regenerate embeddings for ALL documents. Continue?")) {
      return;
    }

    setRegenerating(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/regenerate-embeddings", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${data.message}`);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Failed to regenerate embeddings");
    } finally {
      setRegenerating(false);
    }
  };

  // Delete document
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/documents/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage("✅ Document deleted successfully!");
        fetchDocuments();
      } else {
        setMessage("❌ Failed to delete document");
      }
    } catch (error) {
      setMessage("❌ Failed to delete document");
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-gray-500 mt-2">Sign in to manage knowledge base</p>
          </div>

          {authError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {authLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📚 Knowledge Base Admin
          </h1>
          <p className="text-gray-600">
            Manage your AI assistant's knowledge base documents
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <p className="text-sm">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Document Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              ➕ Add New Document
            </h2>
            <form onSubmit={handleAddDocument} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Support Hours"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                  placeholder="Enter the document content..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Adding..." : "Add Document"}
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              ⚙️ Actions
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Regenerate All Embeddings
                </h3>
                <p className="text-sm text-yellow-700 mb-3">
                  This will regenerate vector embeddings for all documents. Use
                  this if embeddings are missing or corrupted.
                </p>
                <button
                  onClick={handleRegenerateEmbeddings}
                  disabled={regenerating}
                  className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {regenerating ? "Regenerating..." : "Regenerate Embeddings"}
                </button>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  📊 Statistics
                </h3>
                <p className="text-sm text-blue-700">
                  Total Documents: <strong>{documents.length}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📄 Existing Documents
          </h2>
          <div className="space-y-4">
            {documents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No documents yet. Add your first document above!
              </p>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{doc.title}</h3>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {doc.content.substring(0, 200)}
                    {doc.content.length > 200 ? "..." : ""}
                  </p>
                  <p className="text-xs text-gray-400">
                    Created: {new Date(doc.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
