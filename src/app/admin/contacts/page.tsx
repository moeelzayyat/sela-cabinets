'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Phone, Mail, Building, MapPin, X, Edit, Trash2, Star } from 'lucide-react'

interface Contact {
  id: string
  name: string
  company: string
  phone: string
  email: string
  address: string
  contact_type: string
  notes: string
  tags: string[]
  created_at: string
}

interface RegisteredUser {
  id: number
  email: string
  full_name: string | null
  phone: string | null
  provider: 'password' | 'google'
  is_admin: boolean
  created_at: string
}

const contactTypes = [
  { value: 'customer', label: 'Past Customer', icon: '👤', color: 'emerald' },
  { value: 'supplier', label: 'Supplier', icon: '📦', color: 'blue' },
  { value: 'contractor', label: 'Contractor', icon: '🔧', color: 'amber' },
  { value: 'crew', label: 'Crew Member', icon: '👷', color: 'purple' },
  { value: 'referral_partner', label: 'Referral Partner', icon: '🤝', color: 'rose' },
  { value: 'other', label: 'Other', icon: '📌', color: 'slate' }
]

const typeColors: Record<string, { bg: string; text: string }> = {
  customer: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  supplier: { bg: 'bg-blue-100', text: 'text-blue-700' },
  contractor: { bg: 'bg-amber-100', text: 'text-amber-700' },
  crew: { bg: 'bg-purple-100', text: 'text-purple-700' },
  referral_partner: { bg: 'bg-rose-100', text: 'text-rose-700' },
  other: { bg: 'bg-slate-100', text: 'text-slate-700' }
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [users, setUsers] = useState<RegisteredUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    address: '',
    contactType: 'other',
    notes: '',
    tags: ''
  })

  useEffect(() => {
    fetchContacts()
    fetchUsers()
  }, [typeFilter])

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (typeFilter) params.append('type', typeFilter)
      if (searchQuery) params.append('search', searchQuery)
      
      const res = await fetch(`/api/contacts?${params}`)
      const data = await res.json()
      setContacts(data.contacts || [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const toggleAdminAccess = async (user: RegisteredUser) => {
    try {
      await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: !user.is_admin })
      })
      fetchUsers()
    } catch (error) {
      console.error('Error updating admin access:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchContacts()
  }

  const handleCreateContact = () => {
    setSelectedContact(null)
    setFormData({
      name: '',
      company: '',
      phone: '',
      email: '',
      address: '',
      contactType: 'other',
      notes: '',
      tags: ''
    })
    setShowModal(true)
  }

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact)
    setFormData({
      name: contact.name,
      company: contact.company || '',
      phone: contact.phone || '',
      email: contact.email || '',
      address: contact.address || '',
      contactType: contact.contact_type,
      notes: contact.notes || '',
      tags: contact.tags?.join(', ') || ''
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const contactData = {
      name: formData.name,
      company: formData.company || null,
      phone: formData.phone || null,
      email: formData.email || null,
      address: formData.address || null,
      contactType: formData.contactType,
      notes: formData.notes || null,
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean)
    }

    try {
      if (selectedContact) {
        await fetch(`/api/contacts/${selectedContact.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactData)
        })
      } else {
        await fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactData)
        })
      }
      setShowModal(false)
      fetchContacts()
    } catch (error) {
      console.error('Error saving contact:', error)
    }
  }

  const handleDelete = async (contact: Contact) => {
    if (!confirm(`Delete ${contact.name}?`)) return
    
    try {
      await fetch(`/api/contacts/${contact.id}`, { method: 'DELETE' })
      fetchContacts()
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const filteredContacts = contacts.filter(contact => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        contact.name?.toLowerCase().includes(query) ||
        contact.company?.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        contact.phone?.includes(query)
      )
    }
    return true
  })

  const groupedContacts = filteredContacts.reduce((acc, contact) => {
    const type = contact.contact_type
    if (!acc[type]) acc[type] = []
    acc[type].push(contact)
    return acc
  }, {} as Record<string, Contact[]>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-500 mt-1">Manage customers, suppliers, and partners</p>
        </div>
        <button onClick={handleCreateContact} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
          <Plus className="w-4 h-4" />
          New Contact
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, company, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Types</option>
            {contactTypes.map(type => (
              <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
            ))}
          </select>
          <button type="submit" className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            Search
          </button>
        </form>
      </div>

      {/* Registered Website Users */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900">Registered Website Users</h2>
          <span className="text-sm text-slate-500">{users.length} users</span>
        </div>
        <div className="space-y-2">
          {users.length === 0 ? (
            <p className="text-sm text-slate-500">No registered users yet.</p>
          ) : users.map(user => (
            <div key={user.id} className="flex items-center justify-between border border-slate-200 rounded-lg p-3">
              <div>
                <div className="font-medium text-slate-900">{user.full_name || 'Unnamed User'} <span className="text-xs text-slate-500">({user.provider})</span></div>
                <div className="text-sm text-slate-600">{user.email}{user.phone ? ` • ${user.phone}` : ''}</div>
              </div>
              <button
                onClick={() => toggleAdminAccess(user)}
                className={`px-3 py-1.5 text-xs rounded-lg ${user.is_admin ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
              >
                {user.is_admin ? 'Revoke Admin' : 'Grant Admin'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {contactTypes.map(type => {
          const count = contacts.filter(c => c.contact_type === type.value).length
          const colors = typeColors[type.value]
          return (
            <div
              key={type.value}
              onClick={() => setTypeFilter(typeFilter === type.value ? '' : type.value)}
              className={`p-3 rounded-xl cursor-pointer transition-all ${
                typeFilter === type.value 
                  ? `${colors.bg} ${colors.text} ring-2 ring-offset-2` 
                  : 'bg-white border border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs opacity-75">{type.label}</div>
            </div>
          )
        })}
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-500">Loading contacts...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Contacts Found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-4">
            {searchQuery || typeFilter ? 'Try adjusting your filters.' : 'Add your first contact to get started.'}
          </p>
          {!searchQuery && !typeFilter && (
            <button onClick={handleCreateContact} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
              Add First Contact
            </button>
          )}
        </div>
      ) : typeFilter ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredContacts.map(contact => (
            <ContactCard key={contact.id} contact={contact} onEdit={handleEditContact} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedContacts).map(([type, typeContacts]) => {
            const typeInfo = contactTypes.find(t => t.value === type) || contactTypes[5]
            const colors = typeColors[type]
            
            return (
              <div key={type}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{typeInfo.icon}</span>
                  <h2 className="text-lg font-semibold text-slate-900">{typeInfo.label}</h2>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
                    {typeContacts.length}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {typeContacts.map(contact => (
                    <ContactCard key={contact.id} contact={contact} onEdit={handleEditContact} onDelete={handleDelete} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedContact ? 'Edit Contact' : 'New Contact'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                <select
                  value={formData.contactType}
                  onChange={(e) => setFormData({ ...formData, contactType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {contactTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(313) 555-0123"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main St, Detroit, MI"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="VIP, referral, kitchen (comma separated)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-between pt-4">
                {selectedContact && (
                  <button type="button" onClick={() => handleDelete(selectedContact)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                    {selectedContact ? 'Update' : 'Create'} Contact
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function ContactCard({ contact, onEdit, onDelete }: { contact: Contact; onEdit: (c: Contact) => void; onDelete: (c: Contact) => void }) {
  const colors = typeColors[contact.contact_type] || typeColors.other
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:border-amber-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center font-bold ${colors.text}`}>
            {contact.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{contact.name}</div>
            {contact.company && (
              <div className="text-sm text-slate-500 flex items-center gap-1">
                <Building className="w-3 h-3" />
                {contact.company}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => onEdit(contact)}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4 text-slate-400" />
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        {contact.phone && (
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-4 h-4 text-slate-400" />
            <a href={`tel:${contact.phone}`} className="hover:text-amber-600">{contact.phone}</a>
          </div>
        )}
        {contact.email && (
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="w-4 h-4 text-slate-400" />
            <a href={`mailto:${contact.email}`} className="hover:text-amber-600 truncate">{contact.email}</a>
          </div>
        )}
        {contact.address && (
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="truncate">{contact.address}</span>
          </div>
        )}
      </div>
      
      {contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {contact.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}
