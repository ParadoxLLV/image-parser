import toast from 'react-hot-toast';
import { convertableExtensions } from './../../lib/constants';
import type { Dispatch, SetStateAction } from 'react';

type handleUploaderFilesProps = {
  setFiles: Dispatch<SetStateAction<File[]>>;
  files: File[];
  maxUploads: number;
  filesFromDataTransfer: FileList;
};

export const handleUploaderFiles = ({
  setFiles,
  files,
  maxUploads,
  filesFromDataTransfer,
}: handleUploaderFilesProps) => {
  const n = maxUploads - files.length;
  const dataTransferArray = Array.from(filesFromDataTransfer);
  const validFiles = dataTransferArray.filter((file) =>
    convertableExtensions.includes(file.type),
  );
  if (validFiles.length < filesFromDataTransfer.length) {
    toast.error(
      `${dataTransferArray.length - validFiles.length} File(s) with unsupported formats provided.`,
    );
  }
  if (files.length < maxUploads) {
    if (files.length + validFiles.length > maxUploads) {
      for (let i = 0; i < n; i++) {
        setFiles((prev) => [...prev, validFiles[i]]);
      }
      toast.error(
        'File limit reached! upgrade to another plan to get a bigger upload limit.',
      );
    } else {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  } else {
    toast.error(
      'File limit reached! upgrade to another plan to get a bigger upload limit.',
    );
  }
};
