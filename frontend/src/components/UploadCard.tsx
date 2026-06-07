import { useState, useRef } from "react";
import { ReactCompareSlider, ReactCompareSliderImage, ReactCompareSliderHandle } from "react-compare-slider";
import toast from "react-hot-toast";

const isDev = import.meta.env.DEV;
const fallbackUrl = isDev ? "http://localhost:8000" : "https://bijanmurmu-nulldrop-backend.hf.space";
const RAW_API_URL = import.meta.env.VITE_API_URL || fallbackUrl;
const API_URL = RAW_API_URL.replace(/\/$/, ""); // Strip trailing slash to prevent 307 Redirect CORS errors
const UploadCard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("PLEASE PROVIDE A VALID IMAGE.");
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setOutputUrl(null);
  };

  const processImage = async () => {
    if (!file) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/remove-bg`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("EXTRACTION FAILED");

      const blob = await response.blob();
      setOutputUrl(URL.createObjectURL(blob));
      toast.success("ISOLATION COMPLETE");
    } catch (err: any) {
      toast.error(err.message || "SYSTEM ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (format: 'webp' | 'png' | 'jpeg') => {
    if (!outputUrl) return;

    if (format === 'webp') {
      const a = document.createElement('a');
      a.href = outputUrl;
      a.download = `nulldrop-isolated.webp`;
      a.click();
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      
      const a = document.createElement('a');
      a.href = canvas.toDataURL(`image/${format}`, 1.0);
      a.download = `nulldrop-isolated.${format === 'jpeg' ? 'jpg' : 'png'}`;
      a.click();
    };
    img.src = outputUrl;
  };

  return (
    <div className="w-full flex-grow min-h-[500px] lg:min-h-0 max-h-[700px] max-w-4xl bg-editorial-bg border border-editorial-fg/10 shadow-2xl shadow-editorial-fg/5 flex flex-col">
      {!preview ? (
        <div
          className={`flex-grow w-full flex flex-col items-center justify-center p-12 cursor-pointer transition-colors ${
            isDragging ? "bg-editorial-surface border-editorial-fg/30" : "bg-transparent border-editorial-fg/10 hover:bg-editorial-surface/50"
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 border rounded-full border-editorial-fg/20 flex items-center justify-center mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6">
              <path d="M12 17V3" />
              <path d="M7 8l5-5 5 5" />
              <path d="M3 21h18" />
            </svg>
          </div>
          <h3 className="font-serif text-2xl italic text-editorial-fg mb-3">Provide an Artifact</h3>
          <p className="font-sans text-xs tracking-widest uppercase text-editorial-fg/50">Click or Drag to upload</p>
          <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} accept="image/*" className="hidden" />
        </div>
      ) : (
        <div className="flex flex-col flex-grow h-full overflow-hidden">
          <div className="p-4 md:p-6 border-b border-editorial-fg/10 flex justify-between items-center">
            <span className="font-sans text-xs tracking-widest uppercase text-editorial-fg/60 truncate max-w-[250px]">{file?.name}</span>
            <button onClick={() => { setPreview(null); setOutputUrl(null); }} className="text-editorial-fg/40 hover:text-editorial-accent transition-colors text-xs tracking-widest uppercase">
              Discard
            </button>
          </div>
          
          <div className="flex-grow relative bg-editorial-surface/30 overflow-hidden">
            <div className="absolute inset-4 md:inset-8 flex items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-editorial-fg/20 border-t-editorial-fg rounded-full animate-spin"></div>
                  <p className="font-sans text-xs tracking-widest uppercase text-editorial-fg/50 animate-pulse">Running Isolation...</p>
                </div>
              ) : outputUrl ? (
                <ReactCompareSlider
                  itemOne={<ReactCompareSliderImage src={preview!} alt="Original" style={{ objectFit: 'contain' }} />}
                  itemTwo={<ReactCompareSliderImage src={outputUrl!} alt="Isolated" style={{ objectFit: 'contain' }} />}
                  className="w-full h-full"
                />
              ) : (
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              )}
            </div>
          </div>

          <div className="p-4 md:p-6 border-t border-editorial-fg/10 bg-editorial-bg flex justify-between items-center shrink-0">
            {!outputUrl ? (
              <div className="w-full flex justify-end">
                <button onClick={processImage} disabled={isLoading} className="btn-editorial w-full sm:w-auto">
                  Execute Isolation
                </button>
              </div>
            ) : (
              <>
                <span className="font-sans text-[10px] tracking-widest uppercase text-editorial-fg/40 hidden sm:block">Export Artifact As:</span>
                <div className="flex gap-4 w-full sm:w-auto">
                  <button onClick={() => handleDownload('webp')} className="btn-editorial-outline flex-1 sm:flex-none py-3 px-6">
                    WEBP
                  </button>
                  <button onClick={() => handleDownload('png')} className="btn-editorial-outline flex-1 sm:flex-none py-3 px-6">
                    PNG
                  </button>
                  <button onClick={() => handleDownload('jpeg')} className="btn-editorial-outline flex-1 sm:flex-none py-3 px-6">
                    JPG
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCard;