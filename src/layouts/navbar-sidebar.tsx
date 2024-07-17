import { Footer } from "flowbite-react";
import type { FC, PropsWithChildren } from "react";
import { useState } from "react";
import ExampleNavbar from "../components/navbar";
import ExampleSidebar from "../components/sidebar";
import { MdFacebook } from "react-icons/md";
import { FaDribbble, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

interface NavbarSidebarLayoutProps {
  isFooter?: boolean;
}

const NavbarSidebarLayout: FC<PropsWithChildren<NavbarSidebarLayoutProps>> = function ({ children, isFooter = true }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <ExampleNavbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex items-start pt-16">
        <ExampleSidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        <MainContent isFooter={isFooter}>{children}</MainContent>
      </div>
    </>
  );
};

const MainContent: FC<PropsWithChildren<NavbarSidebarLayoutProps>> = function ({
  children,
  isFooter,
}) {
  return (
    <main className="flex-grow h-full w-full overflow-y-auto bg-gray-50 dark:bg-gray-900 md:ml-10">
      <div className="p-4">
        {children}
        {isFooter && (
          <div className="mt-4">
            <MainContentFooter />
          </div>
        )}
      </div>
    </main>
  );
};

const MainContentFooter: FC = function () {
  return (
    <Footer container>
      <div className="flex w-full flex-col gap-y-6 lg:flex-row lg:justify-between lg:gap-y-0">
        <Footer.LinkGroup>
          <Footer.Link href="#" className="mr-3 mb-3 lg:mb-0">
            Terms and conditions
          </Footer.Link>
          <Footer.Link href="#" className="mr-3 mb-3 lg:mb-0">
            Privacy Policy
          </Footer.Link>
          <Footer.Link href="#" className="mr-3">
            Licensing
          </Footer.Link>
          <Footer.Link href="#" className="mr-3">
            Cookie Policy
          </Footer.Link>
          <Footer.Link href="#">Contact</Footer.Link>
        </Footer.LinkGroup>
        <Footer.LinkGroup>
          <div className="flex gap-x-1">
            <Footer.Link
              href="#"
              className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
            >
              <MdFacebook className="text-lg" />
            </Footer.Link>
            <Footer.Link
              href="#"
              className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
            >
              <FaInstagram className="text-lg" />
            </Footer.Link>
            <Footer.Link
              href="#"
              className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
            >
              <FaTwitter className="text-lg" />
            </Footer.Link>
            <Footer.Link
              href="#"
              className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
            >
              <FaGithub className="text-lg" />
            </Footer.Link>
            <Footer.Link
              href="#"
              className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
            >
              <FaDribbble className="text-lg" />
            </Footer.Link>
          </div>
        </Footer.LinkGroup>
      </div>
    </Footer>
  );
};

export default NavbarSidebarLayout;
