/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Breadcrumb,
    Button,
    Label,
    Modal,
    Table,
    TextInput,Select
  } from "flowbite-react";
  import type { FC } from "react";
  import { useState } from "react";
  import { HiChevronLeft, HiChevronRight, HiCog, HiDocumentDownload, HiDotsVertical, HiExclamationCircle, HiHome, HiOutlineExclamationCircle, HiOutlinePencilAlt, HiPlus, HiTrash, HiCheck } from "react-icons/hi";
  import NavbarSidebarLayout from "../../../layouts/navbar-sidebar";
  import { useEffect } from 'react';
  import Cookies from 'js-cookie'; 
  import axios from 'axios';
  import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'; 
  
  
  interface User {
    id: number;
    fname: string;
    lname: string;

    sex:boolean;
    university_id:string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    profile_img_path: string | null;
    student_card_img_path : string | null;
  }
  
  const AdminListPage: FC = function () {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
    const toggleDropdown = () => {
      setIsDropdownOpen((prev) => !prev);
    };
  
    return (
      <NavbarSidebarLayout isFooter={false}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <Breadcrumb className="mb-4">
                <Breadcrumb.Item href="#">
                  <div className="flex items-center gap-x-3">
                    <HiHome className="text-xl" />
                    <span className="dark:text-white">Home</span>
                  </div>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="/admin/list">Users</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
              </Breadcrumb>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
               Verified Users
              </h1>
            </div>
            <div className="sm:flex">
              <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
                <form className="lg:pr-3">
                  <Label htmlFor="users-search" className="sr-only">Search</Label>
                  <div className="relative mt-1 lg:w-64 xl:w-96">
                    <TextInput
                      id="users-search"
                      name="users-search"
                      placeholder="Search for users"
                    />
                  </div>
                </form>
                <div className="mt-3 flex space-x-1 pl-0 sm:mt-0 sm:pl-2">
                  <a href="#" className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span className="sr-only">Configure</span>
                    <HiCog className="text-2xl" />
                  </a>
                  <a href="#" className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span className="sr-only">Delete</span>
                    <HiTrash className="text-2xl" />
                  </a>
                  <a href="#" className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span className="sr-only">Purge</span>
                    <HiExclamationCircle className="text-2xl" />
                  </a>
                  <div className="relative">
                    <button
                      onClick={toggleDropdown}
                      className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <span className="sr-only">Settings</span>
                      <HiDotsVertical className="text-2xl" />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 dark:bg-gray-800">
                        <Link to="/users/unverified/list" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Unverified Users</Link>
                        <Link to="/users/verified/list" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Verified Users</Link>
                        <Link to="/users/list" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">All Users</Link>
                        </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
               
                <Button color="gray">
                  <div className="flex items-center gap-x-3">
                    <HiDocumentDownload className="text-xl" />
                    <span>Export</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <AllUsersTable />
              </div>
            </div>
          </div>
        </div>
        <Pagination />
      </NavbarSidebarLayout>
    );
  };
  
  
 
  
  
  const AllUsersTable: FC = function () {
    const [users, setUsers] = useState<User[]>([]);
    const [universityNames, setUniversityNames] = useState<{ [key: string]: string }>({});
    const [isImageModalOpen, setImageModalOpen] = useState(false);
    const [imageToPreview, setImageToPreview] = useState<string | null>(null);
  
    useEffect(() => {
      // Fetch users
      axios
        .get<User[]>('http://209.38.40.216:8000/api/v1/admins/users/verified', {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        })
        .then((response) => {
          setUsers(response.data);
          response.data.forEach(user => {
            fetchUniversityName(user.university_id);
          });
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
        });
    }, []);
  

    const fetchUniversityName = async (universityId: string) => {
      if (universityNames[universityId]) return; 
  
      try {
        const response = await axios.get<{ name: string }>(`http://209.38.40.216:8000/api/v1/universities/${universityId}`, {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        });
        setUniversityNames((prev) => ({
          ...prev,
          [universityId]: response.data.name,
        }));
      } catch (error) {
        console.error(`Error fetching university name for ID ${universityId}:`, error);
      }
    };
  
   
  
    const handleSex = (sex: boolean): string => {
      return sex ? 'Male' : 'Female';
    };
    const handleImageClick = (imageUrl: string) => {
        setImageToPreview(imageUrl);
        setImageModalOpen(true);
      };
  
    return (
        <>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Id</Table.HeadCell>
          <Table.HeadCell>First Name</Table.HeadCell>
          <Table.HeadCell>Last Name</Table.HeadCell>
       
          <Table.HeadCell>Profile Photo</Table.HeadCell>
          <Table.HeadCell>Student Card</Table.HeadCell>
          <Table.HeadCell>Sex</Table.HeadCell>
          <Table.HeadCell>University</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
         
        </Table.Head>
        <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {users.map((user) => (
            <Table.Row key={user.id}>
            <Table.Cell className=" font-medium text-gray-900 dark:text-white">{user.id}</Table.Cell>

              <Table.Cell className=" font-medium text-gray-900 dark:text-white">{user.fname}</Table.Cell>
              <Table.Cell className=" font-medium text-gray-900 dark:text-white">{user.lname}</Table.Cell>
             
              <Table.Cell className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <img 
                    src={`http://209.38.40.216:8000/uploads/${user. profile_img_path}`} 
                    alt={user.email} 
                    className="h-16 w-16 object-contain dark:bg-white cursor-pointer" 
                    onClick={() => handleImageClick(`http://209.38.40.216:8000/uploads/${user. profile_img_path}`)}
                  />
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <img 
                    src={`http://209.38.40.216:8000/uploads/${user.student_card_img_path}`} 
                    alt={user.email} 
                    className="h-16 w-16 object-contain dark:bg-white cursor-pointer" 
                    onClick={() => handleImageClick(`http://209.38.40.216:8000/uploads/${user.student_card_img_path}`)}
                  />
                </Table.Cell>
              
             
              <Table.Cell className=" font-medium text-gray-900 dark:text-white">{handleSex(user.sex)}</Table.Cell>

              <Table.Cell className=" font-medium text-gray-900 dark:text-white">
              {universityNames[user.university_id] || 'Loading...'}
            </Table.Cell>
              
              <Table.Cell className=" font-medium text-gray-900 dark:text-white">{user.email}</Table.Cell>
  
              
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {imageToPreview && (
          <Modal show={isImageModalOpen} onClose={() => setImageModalOpen(false)}>
            <div className="relative">
              <button
                onClick={() => setImageModalOpen(false)}
                className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <Modal.Body>
                <img src={imageToPreview} alt="Preview" className="w-full h-auto" />
              </Modal.Body>
            </div>
          </Modal>
        )}
      </>
    );
  };
  
 
  
 
  
  
  export const Pagination: FC = function () {
    return (
      <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex sm:justify-between">
        <div className="mb-4 flex items-center sm:mb-0">
          <a
            href="#"
            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Previous page</span>
            <HiChevronLeft className="text-2xl" />
          </a>
          <a
            href="#"
            className="mr-2 inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Next page</span>
            <HiChevronRight className="text-2xl" />
          </a>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing&nbsp;
            <span className="font-semibold text-gray-900 dark:text-white">
              1-20
            </span>
            &nbsp;of&nbsp;
            <span className="font-semibold text-gray-900 dark:text-white">
              2290
            </span>
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href="#"
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 py-2 px-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            <HiChevronLeft className="mr-1 text-base" />
            Previous
          </a>
          <a
            href="#"
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 py-2 px-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Next
            <HiChevronRight className="ml-1 text-base" />
          </a>
        </div>
      </div>
    );
  };
  
  export default AdminListPage;
  