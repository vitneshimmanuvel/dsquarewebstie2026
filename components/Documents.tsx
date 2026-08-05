import React, { useState } from 'react';
import { Folder, FileText, Image, MoreVertical, Plus, X, Upload } from 'lucide-react';

const DocumentManager: React.FC = () => {
  const [folders, setFolders] = useState([
    { name: 'Contracts & Agreements', count: 12 },
    { name: 'Blueprints & Designs', count: 45 },
    { name: 'Invoices & Receipts', count: 128 },
    { name: 'Permits & Approvals', count: 8 },
  ]);

  const [files, setFiles] = useState([
    { name: 'Skyline_Villa_Structural_v3.pdf', type: 'PDF', size: '4.2 MB', date: 'Today' },
    { name: 'Material_Order_Feb24.xlsx', type: 'XLS', size: '1.5 MB', date: 'Yesterday' },
    { name: 'Site_Inspection_Photo_004.jpg', type: 'IMG', size: '3.8 MB', date: 'Yesterday' },
    { name: 'Ground_Floor_Plan.dwg', type: 'CAD', size: '12.4 MB', date: 'Feb 20, 2024' },
  ]);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<{name: string, type: string}>({name: '', type: 'PDF'});

  const handleUpload = () => {
    if(uploadFile.name) {
        const newFile = {
            name: uploadFile.name,
            type: uploadFile.type,
            size: '1.2 MB',
            date: 'Just Now'
        };
        setFiles([newFile, ...files]);
        setIsUploadOpen(false);
        setUploadFile({name: '', type: 'PDF'});
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Document Storage</h2>
          <p className="text-slate-500">Secure digital vault for all project files.</p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="bg-brand-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-brand-900 transition-colors shadow-lg shadow-brand-primary/20"
        >
          <Plus size={18} /> Upload File
        </button>
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-lg text-slate-800">Upload New Document</h3>
               <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
             </div>
             <div className="p-6 space-y-4">
               <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                  <Upload size={32} className="mb-2" />
                  <p className="text-sm">Drag & Drop files here or click to browse</p>
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">File Name</label>
                 <input type="text" className="w-full p-2 border rounded-lg" value={uploadFile.name} onChange={e => setUploadFile({...uploadFile, name: e.target.value})} placeholder="e.g. Project Plan v2" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">File Type</label>
                 <select className="w-full p-2 border rounded-lg" value={uploadFile.type} onChange={e => setUploadFile({...uploadFile, type: e.target.value})}>
                   <option value="PDF">PDF Document</option>
                   <option value="IMG">Image (JPG/PNG)</option>
                   <option value="XLS">Excel Sheet</option>
                   <option value="CAD">CAD Drawing</option>
                 </select>
               </div>
             </div>
             <div className="p-6 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
               <button onClick={() => setIsUploadOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium">Cancel</button>
               <button onClick={handleUpload} className="px-4 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-800 flex items-center gap-2">
                 <Upload size={18} /> Upload
               </button>
             </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {folders.map((folder, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group">
             <Folder size={32} className="text-brand-accent mb-4 group-hover:scale-110 transition-transform" />
             <h3 className="font-bold text-slate-800">{folder.name}</h3>
             <p className="text-xs text-slate-400 mt-1">{folder.count} files</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-800">Recent Uploads</div>
        <div className="divide-y divide-slate-50">
          {files.map((file, i) => (
            <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer">
              <div className={`p-3 rounded-lg ${
                file.type === 'PDF' ? 'bg-red-100 text-red-600' :
                file.type === 'XLS' ? 'bg-green-100 text-green-600' :
                file.type === 'IMG' ? 'bg-purple-100 text-purple-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {file.type === 'IMG' ? <Image size={20} /> : <FileText size={20} />}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-800">{file.name}</h4>
                <p className="text-xs text-slate-400">{file.size} • {file.date}</p>
              </div>
              <button className="p-2 hover:bg-slate-200 rounded-full text-slate-400">
                <MoreVertical size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentManager;