import React, { useState, type Dispatch, type SetStateAction } from 'react';
import { convertableExtensions } from '../../lib/constants';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { handleUploaderFiles } from './handleUploaderFiles';

type FileUploaderProps = {
  setFiles: Dispatch<SetStateAction<File[]>>;
  files: File[];
  maxUploads: number;
  name?: string;
};

const FileUploader = ({
  setFiles,
  files,
  maxUploads,
  name,
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleUploaderFiles({
      setFiles,
      files,
      maxUploads,
      filesFromDataTransfer: e.dataTransfer.files,
    });
    setIsDragging(false);
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onChange = (fileList: FileList) => {
    console.log(files);
    handleUploaderFiles({
      setFiles,
      files,
      maxUploads,
      filesFromDataTransfer: fileList,
    });
    setIsDragging(false);
  };

  return (
    <div
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      className="dark:bg-accent-dark/10 bg-accent/10 transition duration-300 hover:dark:bg-accent-dark/20 hover:bg-accent-dark/20 flex items-center justify-center rounded-xl border-2 border-dashed dark:border-accent-dark/50 h-60 px-2"
    >
      <label className="rounded-full py-2 dark:bg-accent-dark/30 bg-accent max-w-96 w-full cursor-pointer">
        <div className="flex items-center gap-2 justify-center">
          <span className="text-balance sm:text-xl">
            {' '}
            Click here or drag to add files
          </span>
          <span className="text-balance sm:text-xl">
            <IoCloudUploadOutline />
          </span>
        </div>
        <input
          multiple
          onChange={(e) => onChange(e.target.files!)}
          className="hidden"
          type="file"
          name={name ?? 'files'}
          accept={convertableExtensions.join(',')}
        />
      </label>
    </div>
  );
};

export default FileUploader;
