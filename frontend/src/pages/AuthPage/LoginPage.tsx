import { FaGithub, FaGoogle } from 'react-icons/fa6';
import { TbLockPassword, TbMail } from 'react-icons/tb';
import * as z from 'zod';
import { useState } from 'react';
import { MdOutlineDangerous } from 'react-icons/md';
import CustomInput from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import CustomAlert from '../../components/CustomAlert';
import Seperator from '../../components/Seperator';
import {
  useAppDispatch,
  useAppSelector,
} from '../../Redux/reduxHooks/reduxHooks';
import toast from 'react-hot-toast';
import { getCurrentUser } from '../../Redux/reducers/userReducer';
import axiosInstance from '../../helpers/utils/axiosInterceptor';
import { auth } from '../../helpers/utils/auth';

function navigate(url: string) {
  window.location.href = url;
}

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be atleast 8 characters long')
    .regex(/[0-9]/, 'Must contain atleast one number')
    .regex(
      /[`!@#$%^&*()\-+=_]/,
      'Must contain one special character (!, @, $, ...)',
    ),
});

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<z.ZodError | null>(null);
  const dispatch = useAppDispatch();
  const fingerprint = useAppSelector(
    (state) => state.user.fingerprint as string,
  );

  const handleSubmit = async ({
    email,
    password,
  }: z.infer<typeof loginSchema>) => {
    const result = loginSchema.safeParse({ email, password });
    if (result.success) {
      try {
        const axiosResult = await axiosInstance.post('/auth/login', {
          email,
          password,
        });

        const cause = axiosResult.data.cause;

        if (axiosResult.status === 200) {
          await dispatch(getCurrentUser()).unwrap()
          navigate(`http://localhost:5174/auth-success?successCause=${cause}`);
          toast(axiosResult.data.message);
        }
      } catch (error) {
        const cause = error.response?.data?.cause || 'UnsuccessfulLogin';
        navigate(`http://localhost:5174/auth-fail?failCause=${cause}`);
        console.error(error);
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="w-full flex justify-center items-center py-10">
      <div className="flex justify-between flex-col gap-3 p-4 items-center bg-linear-to-r from-accent/70 to-accent-dark/30 rounded-xl w-lg">
        <h1 className="text-3xl dark:text-white text-text">Login</h1>
        <form
          className="flex flex-col gap-2 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit({ email, password });
          }}
        >
          <div>
            <CustomInput
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              variant={error ? 'alert' : 'default'}
              type="email"
              placeholder="Enter your email"
              icon={<TbMail />}
            ></CustomInput>
            {error &&
              error.issues
                .filter((issue) => issue.path[0] === 'email')
                .map((issue) => (
                  <CustomAlert
                    className="last:mb-0"
                    variant="error"
                    icon={<MdOutlineDangerous />}
                  >
                    {issue.message}
                  </CustomAlert>
                ))}
          </div>
          <div>
            <CustomInput
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              type="password"
              placeholder="Enter your password"
              variant={error ? 'alert' : 'default'}
              icon={<TbLockPassword />}
            ></CustomInput>
            {error &&
              error.issues
                .filter((issue) => issue.path[0] === 'password')
                .map((issue) => (
                  <CustomAlert
                    className="last:mb-0"
                    variant="error"
                    icon={<MdOutlineDangerous />}
                  >
                    {issue.message}
                  </CustomAlert>
                ))}
          </div>
          <CustomButton type="submit" className="w-full">
            LOGIN
          </CustomButton>
        </form>
        <Seperator
          leftPadding={1}
          rightPadding={4}
          text="or login with"
          className=""
        />
        <div className="flex gap-2 w-full">
          <CustomButton
            type="button"
            className="w-full grow basis-1 gap-2"
            icon={<FaGoogle />}
            onClick={() => auth('google', 'login')}
          ></CustomButton>
          <CustomButton
            type="button"
            className="w-full basis-1 grow gap-2"
            icon={<FaGithub />}
            onClick={() => auth('github', 'login')}
          ></CustomButton>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
