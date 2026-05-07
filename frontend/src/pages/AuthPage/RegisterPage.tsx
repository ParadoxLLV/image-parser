import { CustomButton } from '../../components/CustomButton';
import { FaGithub, FaGoogle } from 'react-icons/fa6';
import CustomInput from '../../components/CustomInput';
import { TbLockPassword, TbMail } from 'react-icons/tb';
import Seperator from '../../components/Seperator';
import * as z from 'zod';
import { useState } from 'react';
import { LuCircleCheckBig } from 'react-icons/lu';
import CustomAlert from '../../components/CustomAlert';
import { MdOutlineDangerous } from 'react-icons/md';
import toast from 'react-hot-toast';
import axiosInstance from '../../helpers/utils/axiosInterceptor';
import { auth } from '../../helpers/utils/auth';

function navigate(url: string) {
  window.location.href = url;
}

const registerSchema = z
  .object({
    email: z.email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be atleast 8 characters long')
      .regex(/[0-9]/, 'Must contain atleast one number')
      .regex(
        /[`!@#$%^&*()\-+=_]/,
        'Must contain one special character (!, @, $, ...)',
      ),
    confirmPassword: z
      .string()
      .min(8, 'Password must be atleast 8 characters long')
      .regex(/[0-9]/, 'Must contain atleast one number')
      .regex(
        /[`!@#$%^&*()\-+=_]/,
        'Must contain one special character (!, @, $, ...)',
      ),
  })
  .refine((data) => data.password == data.confirmPassword, {
    error: "Passwords don't match",
    path: ['confirmPassword'],
  });

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<z.ZodError | null>(null);

  const handleSubmit = async ({
    email,
    password,
    confirmPassword,
  }: z.infer<typeof registerSchema>) => {
    const result = registerSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

    if (result.success) {
      setError(null);
      try {
        const result2 = await axiosInstance.post('/auth/register', {
          email,
          password,
        });

        const cause = result2.data.cause;

        if (result2.status === 200) {
          navigate(`http://localhost:5173/auth-success?successCause=${cause}`);
          toast(result2.data.message);
        }
      } catch (error: any) {
        const cause = error.response?.data?.cause || 'UnsuccessfulRegister';
        navigate(`http://localhost:5173/auth-fail?failCause=${cause}`);
        console.error(error);
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="w-full flex justify-center items-center py-10">
      <div className="flex justify-between flex-col gap-3 p-4 items-center bg-linear-to-r from-accent/70 to-accent-dark/30 rounded-xl w-lg">
        <h1 className="text-3xl dark:text-white text-text">Register</h1>
        <form
          className="flex flex-col gap-2 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit({ email, password, confirmPassword });
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
              placeholder="Pick an email"
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
              placeholder="Pick a password"
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
          <div>
            <CustomInput
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              value={confirmPassword}
              type="password"
              placeholder="Confirm password"
              variant={error ? 'alert' : 'default'}
              icon={<LuCircleCheckBig />}
            ></CustomInput>
            {error &&
              error.issues
                .filter((issue) => issue.path[0] === 'confirmPassword')
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
            REGISTER
          </CustomButton>
        </form>
        <Seperator
          leftPadding={1}
          rightPadding={4}
          text="or register with"
          className=""
        />
        <div className="flex gap-2 w-full">
          <CustomButton
            type="button"
            className="w-full grow basis-1 gap-2"
            icon={<FaGoogle />}
            onClick={() => auth('google', 'register')}
          ></CustomButton>
          <CustomButton
            type="button"
            className="w-full basis-1 grow gap-2"
            icon={<FaGithub />}
            onClick={() => auth('github', 'register')}
          ></CustomButton>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
