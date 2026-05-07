
import { FaArrowRight, FaSyncAlt } from 'react-icons/fa';
import CustomLink from '../../components/CustomLink';

type ProcessedFilesContainerProps = {
    processedFiles: File[],
    convertingFromFormats: string[],
    convertingToFormat: string,
}

const ProcessedFilesContainer = ({processedFiles, convertingFromFormats, convertingToFormat}: ProcessedFilesContainerProps) => {
  return (
    <>
      {processedFiles.length > 0 && (
        <div className="w-full max-w-[548px] flex flex-col gap-2 p-2 dark:bg-accent-dark/70 bg-accent/70">
          {processedFiles.map((file, i) => (
            <div
              key={Math.floor(Math.random() * 9999999)}
              className="w-full flex justify-between p-2 items-center dark:bg-teal-800 bg-accent"
            >
              <img
                className="w-[50px] h-[50px] object-cover"
                src={URL.createObjectURL(file)}
              />
              <div className="flex items-center gap-2">
                <span className="">
                  <FaSyncAlt />
                </span>
                <div className="flex items-center gap-2">
                  <span>{convertingFromFormats[i]}</span>
                  <span>
                    <FaArrowRight />
                  </span>
                  <span>{convertingToFormat}</span>
                </div>
              </div>
              <CustomLink
                variant="red"
                lineVariant="red"
                to={URL.createObjectURL(file)}
                download={`${file.name.split('.')[0]}.${file.type.split('/')[1]}`}
              >
                Download
              </CustomLink>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProcessedFilesContainer;
