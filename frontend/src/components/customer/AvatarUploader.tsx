import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface AvatarUploaderProps {
  initialUrl?: string;
  onAvatarChange?: (url: string) => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  initialUrl,
  onAvatarChange
}) => {
  const [avatar, setAvatar] = useState<string | undefined>(initialUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      if (onAvatarChange) onAvatarChange(imageUrl);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <label className="text-xs font-semibold text-slate-300">Ảnh đại diện</label>

      <div className="relative group cursor-pointer">
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="hidden"
          id="avatar-upload-input"
        />

        <label
          htmlFor="avatar-upload-input"
          className="w-28 h-28 rounded-full border-2 border-dashed border-slate-700 hover:border-cyan-400 bg-slate-900/80 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden shadow-xl"
        >
          {avatar ? (
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
              <Camera className="w-7 h-7 mb-1" />
            </div>
          )}
        </label>
      </div>

      <span className="text-[10px] text-slate-500">JPG, PNG tối đa 2MB</span>
    </div>
  );
};
