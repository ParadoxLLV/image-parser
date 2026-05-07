import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { MdClose } from 'react-icons/md';
import { setBreadcrumb } from '../../Redux/reducers/siteSettingsReducer';
import {
  useAppDispatch,
  useAppSelector,
} from '../../Redux/reduxHooks/reduxHooks';
import { AnimatePresence, motion } from 'motion/react';
import CustomLink from '../CustomLink';

const capitalizedCleanPathname = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const isLast = (cleanPathnames: string[], index: number) => {
  if (cleanPathnames.length - 1 === index) {
    return true;
  } else {
    return false;
  }
};

const Breadcrumb = () => {
  const dispatch = useAppDispatch();
  const searchParams = useLocation();
  const pathnames = searchParams.pathname.split('/');
  const cleanPathnames = pathnames.filter(Boolean);
  let breadcrumbPath = '';

  const [isClosed, setIsClosed] = useState<boolean>(
    useAppSelector((state) => state.siteSettings.enabledBreadcrumb),
  );
  const breadcrumbState = useAppSelector(
    (state) => state.siteSettings.enabledBreadcrumb,
  );

  useEffect(() => {
    setIsClosed((prev) => !prev);
  }, [breadcrumbState]);

  return (
    <div className="sticky top-0 h-full">
      <AnimatePresence>
        {cleanPathnames.length > 0 && !isClosed && (
          <motion.div
            layout
            className="p-2 gap-1 flex flex-col h-full justify-start dark:bg-accent/70 rounded-md bg-accent-dark text-text dark:text-text-dark z-50"
          >
            <div className="flex justify-between">
              <p className="text-sm">Navigation</p>
              <MdClose
                className="cursor-pointer hover:bg-black/15 rounded-md"
                onClick={() => {
                  setIsClosed(true);
                  dispatch(setBreadcrumb(false));
                }}
                size="20"
              />
            </div>
            <div className="flex items-center">
              {cleanPathnames.map((pathname, index) => {
                breadcrumbPath += `/${pathname}`;
                const CapitalizedCleanPathname =
                  capitalizedCleanPathname(pathname);
                const lastEl = isLast(cleanPathnames, index);
                return (
                  <div key={index} className="flex items-center">
                    {index === 0 && (
                      <div className="flex">
                        <CustomLink to="/">Home</CustomLink>
                        <span className="mx-2 text-xl text-center flex items-center select-none">
                          /
                        </span>
                      </div>
                    )}
                    {lastEl ? (
                      <div className="p-2 rounded-md select-none dark:bg-text-dark/15 bg-text/15">
                        {CapitalizedCleanPathname}
                      </div>
                    ) : (
                      <CustomLink to={breadcrumbPath}>
                        {CapitalizedCleanPathname}
                      </CustomLink>
                    )}
                    {!lastEl && (
                      <span className="mx-2 text-xl text-center flex items-center select-none">
                        /
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Breadcrumb;
