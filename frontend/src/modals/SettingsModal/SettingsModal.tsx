import CustomModal from '../../components/Modal/CustomModal';
import GeneralContent from './GeneralContent';
import AccountContent from './AccountContent';
import { isAuthUser } from '../../helpers/utils/isAuthUser';
import {
  useAppSelector,
} from '../../Redux/reduxHooks/reduxHooks';

const SettingsModal = () => {
  const user = useAppSelector((state) => state.user.user);
  const tabs = [
    {
      label: 'General',
      tabContent: {
        content: <GeneralContent />,
        seperatorText: 'General',
      },
    },
  ];
  if (isAuthUser(user)) {
    tabs.push({
      label: 'Account',
      tabContent: {
        content: <AccountContent />,
        seperatorText: 'Account',
      },
    });
  }
  return (
    <>
      <CustomModal tabs={tabs} modalName="settings" />
    </>
  );
};

export default SettingsModal;
