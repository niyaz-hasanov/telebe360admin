import type { FC } from "react";
import { Button, DarkThemeToggle, Navbar } from "flowbite-react";
import { HiMenu } from "react-icons/hi";

interface ExampleNavbarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const ExampleNavbar: FC<ExampleNavbarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  return (
    <Navbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="mr-3 text-gray-900 dark:text-white lg:hidden"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              <HiMenu className="w-6 h-6" />
            </button>
            <Navbar.Brand href="/">
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                Tələbə
              </span>
              <img
                alt=""
                src='https://raw.githubusercontent.com/niyazhsnov/telebe360/df79ee27ff981a8b108e1fe4cc80faf5e777a149/public/home/360minilogo.svg'
                className="mr-3 h-6 sm:h-6"
              />
            </Navbar.Brand>
          </div>
          <div className="flex items-center gap-3">
            <DarkThemeToggle />
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;
