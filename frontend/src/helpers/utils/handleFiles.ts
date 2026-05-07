import axios, { AxiosError } from 'axios';
import type { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

export const handleFiles = async (
  files: File[],
  convertingToFormat: string,
  setProcessedFiles: Dispatch<SetStateAction<File[]>>,
  fingerprint: string,
) => {
  try {
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('convertingToFormat', convertingToFormat.split('/')[1]);
      console.log(formData);
      const result = await axios.post('/server/processFile', formData, {
        headers: {
          fingerprint,
        },
        responseType: 'blob',
        withCredentials: true,
      });
      const fileName = file.name.substring(0, file.name.lastIndexOf('.'));
      const newExtension = convertingToFormat.split('/')[1];
      const convertedFile = new File(
        [result.data],
        `${fileName}.${newExtension}`,
        { type: convertingToFormat },
      );
      console.log('convertedFile', convertedFile);
      setProcessedFiles((prev) => [...prev, convertedFile]);
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    const blobErr = axiosError.response?.data;
    const errorText = blobErr ? JSON.parse(await blobErr.text()).error : error;
    toast.error(errorText);
  }
};
