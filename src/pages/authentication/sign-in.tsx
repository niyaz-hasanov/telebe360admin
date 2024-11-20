/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import axios from 'axios';
import { Button, Card, Label, TextInput } from "flowbite-react";
import Cookies from 'js-cookie';
import {APIURL} from '../../utils/constants'
const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
  const handleLogin = async (e: any) => {
    e.preventDefault();
  
    const endpoint = `${APIURL}auth/sign-in/`.endsWith('/') 
      ? `${APIURL}auth/sign-in/` 
      : `${APIURL}auth/sign-in/`;
  
    try {
      const response = await axios.post(endpoint, {
        email: email,
        password: password,
      });
  
      const token = response.data.access_token;
      Cookies.set('token', token, { expires: inFifteenMinutes, secure: true });
      setError(null);
      setSuccess(true);
  
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      if (error.response) {
        console.error('Server error:', error.response.data);
        setError('Authentication failed');
      } else if (error.request) {
        console.error('Request error:', error.request);
        setError('Could not make request');
      } else {
        console.error('Error:', error.message);
        setError('An error occurred');
      }
      setSuccess(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      <div className="my-6 flex items-center gap-x-1 lg:my-0">
      <span className="self-center whitespace-nowrap text-5xl font-semibold dark:text-white">
          Tələbə
        </span>
        <img
          alt="360logo"
          src='https://raw.githubusercontent.com/niyazhsnov/telebe360/df79ee27ff981a8b108e1fe4cc80faf5e777a149/public/home/360minilogo.svg'
          className="mr-3 h-12"
        />
        
      </div>
      <Card
        horizontal
   
        
        className="w-full md:max-w-screen-sm [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 md:[&>*]:w-full md:[&>*]:p-16 lg:[&>img]:block"
      >
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Sign in to platform
        </h1>
        <form onSubmit={handleLogin}>
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
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">Successful login!</p>}
          <div className="mb-6">
            <Button type="submit" className="w-full lg:w-auto">
              Login to your account
            </Button>
          </div>
          {/* <p className="text-sm text-gray-500 dark:text-gray-300">
            Not registered?&nbsp;
            <a href="/register" className="text-primary-600 dark:text-primary-300">
              Create account
            </a>
          </p> */}
        </form>
      </Card>
    </div>
  );
};

export default SignInPage;
