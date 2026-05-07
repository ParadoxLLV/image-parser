import { useState, type Dispatch, type SetStateAction } from 'react';
import { CustomButton } from '../../components/CustomButton';
import { convertableExtensions } from '../../lib/constants';
import CustomSelect from '../../components/CustomSelect';
import { MdClose } from 'react-icons/md';

type UploadedFilesContainerProps = {
    files: File[];
    processedFiles: File[];
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    maxUploads: number;
    deleteFile: (index: number) => void;
    reset: () => void;
}

const UploadedFilesContainer = ({files, processedFiles, value, setValue, maxUploads, deleteFile, reset}: UploadedFilesContainerProps) => {
    const [clickedItem, setClickedItem] = useState<number>();
  return (
    <div
      className={`${files.length > 0 && 'dark:bg-accent-dark/50 bg-accent/50 rounded-lg p-2 flex w-full justify-center max-w-3xl flex-col gap-2'}`}
    >
      <div className="flex flex-wrap gap-2 justify-center sm:justify-normal">
        {files.length > 0 &&
          files.length <= maxUploads &&
          files.map((file, i) => (
            <div
              key={Math.floor(Math.random() * 9999999)}
              className="group h-[100px] w-[100px] relative text-white"
              onClick={() => setClickedItem(i)}
            >
              <img
                src={URL.createObjectURL(file)}
                className={`object-cover h-full opacity-60 group-hover:opacity-100 transition duration-300 rounded-lg ${clickedItem === i && 'opacity-100'}`}
                alt=""
              />
              {processedFiles.length === 0 && (
                <span
                  onClick={() => deleteFile(i)}
                  className={`cursor-pointer p-1 absolute top-0 right-0 bg-black rounded-md m-1 opacity-0 group-hover:opacity-100 transition duration-300 ${clickedItem === i && 'opacity-100'}`}
                >
                  <MdClose />
                </span>
              )}
              <span className={`opacity-0 transition duration-300 bg-black rounded-md group-hover:opacity-100 bottom-0 text-center w-full text-sm absolute ${clickedItem === i && 'opacity-100'}`}>
                {file.name.slice(0, 10)}...
              </span>
            </div>
          ))}
      </div>
      <div>
        {files.length > 0 && processedFiles.length == 0 && (
          <div className="w-full flex gap-2 flex-col">
            <CustomSelect
              options={convertableExtensions.map((extension) => ({
                optionValue: extension,
              }))}
              setValue={setValue}
              value={value}
            >
              Select a format
            </CustomSelect>
            <CustomButton onClick={() => console.log("Continue clicked")} disabled={value.length === 0} type="submit">
              Continue
            </CustomButton>
          </div>
        )}
        {processedFiles.length > 0 && (
          <CustomButton
            className="w-full"
            onClick={() => reset()}
          >
            Restart
          </CustomButton>
        )}
      </div>
    </div>
  );
};

export default UploadedFilesContainer;
