/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useState } from "react";
import axios from 'axios';
import { Button, Card, Label, TextInput } from "flowbite-react";
import { Navigate } from "react-router-dom";
const SignUpPage: FC = function () {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('https://telebe360.elxanhuseynli.com/api/users', {
        name: name,
        email: email,
        password: password
      });
      setSuccess(true);
      setError(null);
    } catch (error) {
      console.error('Error:', error.message);
      setError('An error occurred');
      setSuccess(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      <div className="my-6 flex items-center justify-center gap-x-1 lg:my-0" style={{marginTop:'5%'}}>
      <span className="self-center whitespace-nowrap text-5xl font-semibold dark:text-white">
          Tələbə
        </span>
        <img
          alt="360logo"
          src="https://raw.githubusercontent.com/niyazhsnov/telebe360/50f8791d2de971c824ce46b11a2e0be91a845b61/public/home/360minilogo.svg"
          className="mr-3 h-12"
        />
      </div>
      <Card
        horizontal
      
        className="w-full md:max-w-screen-sm [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 md:[&>*]:w-full md:[&>*]:p-16 lg:[&>img]:block"
      >
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Create a Free Account
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="name">Your Name</Label>
            <TextInput
              id="name"
              name="name"
              placeholder="Lucifer Michaelson"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="email">Your email</Label>
            <TextInput
              id="email"
              name="email"
              placeholder="name@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password">Your password</Label>
            <TextInput
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <Navigate to="/login" />}
          <div className="mb-7">
            <Button type="submit" className="w-full lg:w-auto">
              Create account
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Already have an account?&nbsp;
            <a href="/login" className="text-primary-600 dark:text-primary-200">
              Login here
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default SignUpPage;
