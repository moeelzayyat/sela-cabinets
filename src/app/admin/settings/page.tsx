export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your CRM preferences</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Business Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input 
                type="text" 
                value="SELA Cabinets" 
                readOnly
                className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input 
                type="text" 
                value="(313) 246-7903" 
                readOnly
                className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                value="info@selacabinets.com" 
                readOnly
                className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Pipeline Stages</h3>
          <p className="text-slate-500 text-sm">
            Customize your lead pipeline stages in the Leads section.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Notifications</h3>
          <p className="text-slate-500 text-sm">
            Configure email and SMS notifications for new leads and follow-ups.
          </p>
        </div>
      </div>
    </div>
  )
}
