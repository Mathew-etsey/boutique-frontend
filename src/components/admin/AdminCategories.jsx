import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories')
      setCategories(response.data.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, formData)
        toast.success('Category updated')
      } else {
        await api.post('/admin/categories', formData)
        toast.success('Category created')
      }
      setFormData({ name: '', description: '' })
      setShowForm(false)
      setEditingCategory(null)
      fetchCategories()
    } catch (error) {
      toast.error('Failed to save category')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await api.delete(`/admin/categories/${id}`)
      toast.success('Category deleted')
      fetchCategories()
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  const startEdit = (category) => {
    setEditingCategory(category)
    setFormData({ name: category.name, description: category.description || '' })
    setShowForm(true)
  }

  const inputClass = "w-full bg-transparent border-b border-ink/20 pb-3 text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold transition-colors duration-300"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold border-t-transparent mx-auto"></div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-ink/50">Loading Categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl font-display font-bold text-ink">
          Categories
        </h1>
        <button
          onClick={() => {
            setEditingCategory(null)
            setFormData({ name: '', description: '' })
            setShowForm(true)
          }}
          className="bg-ink text-bone px-5 py-2.5 rounded-sm font-mono text-xs uppercase tracking-[0.15em] hover:bg-gold hover:text-ink active:scale-[0.97] transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <PlusIcon className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-ink/10 rounded-sm p-5 sm:p-7 mb-6">
          <h3 className="font-display text-lg font-bold text-ink mb-5">
            {editingCategory ? 'Edit Category' : 'New Category'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className={`${inputClass} resize-none`}
              />
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="bg-gold text-ink px-6 py-3 rounded-sm font-mono text-xs uppercase tracking-[0.15em] hover:bg-gold-light active:scale-[0.97] transition-all duration-300"
              >
                {editingCategory ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingCategory(null)
                  setFormData({ name: '', description: '' })
                }}
                className="border border-ink/15 text-ink/70 px-6 py-3 rounded-sm font-mono text-xs uppercase tracking-[0.15em] hover:border-ink/30 active:scale-[0.97] transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white border border-ink/10 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="bg-bone border-b border-ink/10">
                <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Name</th>
                <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Description</th>
                <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Products</th>
                <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 font-mono text-sm text-ink/40">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-b border-ink/5 hover:bg-bone/60 transition">
                    <td className="py-3 px-4 font-medium text-ink text-sm">{category.name}</td>
                    <td className="py-3 px-4 text-sm text-ink/60">{category.description || '—'}</td>
                    <td className="py-3 px-4 font-mono text-sm text-ink/50">{category.products?.length || 0}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(category)}
                          className="p-2 text-ink/60 hover:bg-gold/10 hover:text-gold-dark rounded-sm active:scale-90 transition"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-oxblood/70 hover:bg-oxblood/10 hover:text-oxblood rounded-sm active:scale-90 transition"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminCategories