import { useState } from 'react';
import CustomLink from '../../components/CustomLink';
import FileUploader from './FileUploader';
import {
  useAppDispatch,
  useAppSelector,
} from '../../Redux/reduxHooks/reduxHooks';
import { isAuthUser } from '../../helpers/utils/isAuthUser';
import { handleFiles } from '../../helpers/utils/handleFiles';
import { getCurrentUser } from '../../Redux/reducers/userReducer';
import ProcessedFilesContainer from './ProcessedFilesContainer';
import UploadedFilesContainer from './UploadedFilesContainer';
import {
  MAX_FILES_FREE,
  MAX_FILES_GUESTS,
  MAX_FILES_PLUS,
  MAX_FILES_PREMIUM,
  MAX_FILES_PRO,
} from '../../lib/constants';

const Homepage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processedFiles, setProcessedFiles] = useState<File[]>([]);
  const [value, setValue] = useState<string>('');
  const [convertingToFormat, setConvertingToFormat] = useState<string>('');
  const [convertingFromFormats, setConvertingFromFormats] = useState<string[]>(
    [],
  );

  let maxUploads: number;
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const fingerprint = useAppSelector(
    (state) => state.user.fingerprint as string,
  );

  if (isAuthUser(user)) {
    switch (user.subscription) {
      case 'free':
        maxUploads = MAX_FILES_FREE;
        break;
      case 'plus':
        maxUploads = MAX_FILES_PLUS;
        break;
      case 'premium':
        maxUploads = MAX_FILES_PREMIUM;
        break;
      case 'pro':
        maxUploads = MAX_FILES_PRO;
        break;
      default:
        maxUploads = MAX_FILES_FREE;
    }
  } else {
    maxUploads = MAX_FILES_GUESTS;
  }

  const deleteFile = (index: number) => {
    setFiles((prev) => prev.filter((file, i) => i != index));
  };

  const reset = () => {
    setFiles([]);
    setProcessedFiles([]);
    setConvertingFromFormats([]);
    setConvertingToFormat('');
    setValue('');
  };

  const handleSubmit = async (e: SubmitEvent) => {
    try {
      e.preventDefault();
      files.forEach((file) => {
        setConvertingFromFormats((prev) => [
          ...prev,
          file.type.split('/')[1].toUpperCase(),
        ]);
      });
      setConvertingToFormat(value.split('/')[1].toUpperCase());
      await handleFiles(files, value, setProcessedFiles, fingerprint);
      dispatch(getCurrentUser()).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full dark:text-white text-black flex gap-7 flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center w-full max-w-3xl text-center gap-3">
        <h1 className="text-3xl md:text-4xl font-bold text-balance leading-tight">
          Convert files to any desired format at the click of a button.
        </h1>
        <div className="flex flex-col gap-2 text-lg opacity-90">
          <p className="">
            Register now or convert images as a guest user. Guest users get 10
            credits every month, meanwhile registered users and users with
            active subscriptions get more monthly credits.
            <CustomLink to="pricing">See pricing</CustomLink>
          </p>
        </div>
      </div>
      <form
        encType="multipart/form-data"
        onSubmit={(e) => handleSubmit(e)}
        className="max-w-3xl w-full flex flex-col gap-5"
      >
        <UploadedFilesContainer
          files={files}
          processedFiles={processedFiles}
          value={value}
          setValue={setValue}
          maxUploads={maxUploads}
          deleteFile={deleteFile}
          reset={reset}
        />
        {processedFiles.length === 0 && (
          <FileUploader
            name="files"
            setFiles={setFiles}
            files={files}
            maxUploads={maxUploads}
          />
        )}
      </form>
      <ProcessedFilesContainer
        processedFiles={processedFiles}
        convertingFromFormats={convertingFromFormats}
        convertingToFormat={convertingToFormat}
      />
      <div>
        <span>Credits: {user?.credits}</span>
      </div>
    </div>
  );
};

export default Homepage;
