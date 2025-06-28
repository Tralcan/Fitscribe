"use client";

import { useState, useCallback, useRef, type DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

export function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // You can add a specific drop effect if you want
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onFileSelect]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click();
  }

  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center transition-all duration-300 ease-in-out',
        isDragging ? 'border-primary bg-primary/10' : 'bg-background hover:border-primary/50'
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <UploadCloud className={cn("w-16 h-16 mb-4", isDragging ? "text-primary" : "text-muted-foreground")} />
      <h3 className="text-xl font-semibold text-foreground">Drag & drop your .FIT file here</h3>
      <p className="mt-2 text-muted-foreground">or</p>
      <input
        ref={inputRef}
        type="file"
        accept=".fit"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button onClick={handleButtonClick} className="mt-4" size="lg">
        Browse Files
      </Button>
      <p className="text-xs text-muted-foreground mt-4">Only .FIT files are accepted.</p>
    </div>
  );
}
