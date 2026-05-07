import ModalRow from '../../components/Modal/ModalRow';
import CustomToggle from '../../components/CustomToggle';
import {
  useAppDispatch,
  useAppSelector,
} from '../../Redux/reduxHooks/reduxHooks';
import { setBreadcrumb } from '../../Redux/reducers/siteSettingsReducer';

const GeneralContent = () => {
  const dispatch = useAppDispatch();
  const breadcrumbState = useAppSelector(
    (state) => state.siteSettings.enabledBreadcrumb,
  );
  const user = useAppSelector((state) => state.user.user);
  return (
    <>
      <ModalRow>
        <span>Credits</span>
        <span>{user?.credits}</span>
      </ModalRow>
      <ModalRow>
        <span>Breadcrumb</span>
        <CustomToggle
          onClick={() => {
            dispatch(setBreadcrumb(!breadcrumbState));
          }}
          currValue={breadcrumbState}
        />
      </ModalRow>
    </>
  );
};

export default GeneralContent;
