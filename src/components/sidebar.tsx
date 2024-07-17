import { Sidebar, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  HiChartPie,
  HiClipboard,
  HiDatabase,
  HiUsers,
  HiAcademicCap,
  HiSearch,
  HiOfficeBuilding,
  HiTable,
  HiTicket,
} from "react-icons/hi";

interface ExampleSidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const ExampleSidebar: FC<ExampleSidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    const newPage = window.location.pathname;
    setCurrentPage(newPage);
  }, [setCurrentPage]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={handleOutsideClick}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 w-64 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:transform-none`}
      >
        <Sidebar aria-label="Sidebar with multi-level dropdown example">
          <div className="flex h-full flex-col justify-between py-2">
            <div>
              <form className="pb-3 md:hidden">
                <TextInput
                  icon={HiSearch}
                  type="search"
                  placeholder="Search"
                  required
                  size={32}
                />
              </form>
              <Sidebar.Items>
                <Sidebar.ItemGroup>
                  <Sidebar.Item
                    href="/"
                    icon={HiChartPie}
                    className={
                      "/" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
                    }
                  >
                    Dashboard
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/categories"
                    icon={HiClipboard}
                    className={
                      "/categories" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Categories
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/admins/list"
                    icon={HiDatabase}
                    className={
                      "/admins/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Admins list
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/users/list"
                    icon={HiUsers}
                    className={
                      "/users/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Users list
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/university/list"
                    icon={HiAcademicCap}
                    className={
                      "/university/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    University list
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/companies/list"
                    icon={HiOfficeBuilding}
                    className={
                      "/companies/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Company list
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/banners/list"
                    icon={HiTable}
                    className={
                      "/Banners/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Banner list
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/tickets/list"
                    icon={HiTicket}
                    className={
                      "/Tickets/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Ticket list
                  </Sidebar.Item>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </div>
          </div>
        </Sidebar>
      </div>
    </>
  );
};
export default ExampleSidebar;
