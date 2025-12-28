/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Button,
  Label,
  Modal,
  Table,
  TextInput, Select
} from "flowbite-react";
import type { FC } from "react";
import { useState } from "react";
import { HiChevronLeft, HiChevronRight, HiCog, HiDocumentDownload, HiDotsVertical, HiExclamationCircle, HiHome, HiOutlineExclamationCircle, HiOutlinePencilAlt, HiPlus, HiTrash } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { APIURL, MAINURL } from "../../utils/constants";

interface User {
  id: number;
  fname: string;
  lname: string;
  birth_date: string;
  coins: string;
  sex: boolean;
  university_id: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
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
              All Users
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
              <ImportUserModal />
              <AddUserModal />
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

const AddUserModal: FC = function () {
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fname: "",
    lname: "",
    birth_date: "",
    university_id: "",
    sex: "true",
  });
  const [error, setError] = useState<string | null>(null);
  const [universities, setUniversities] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${APIURL}universities/`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        setUniversities(response.data);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchUniversities();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPassword = (password: string) => {
    const passwordRegex = /^[a-zA-Z0-9][a-zA-Z0-9._@#$%^&]{6,38}[a-zA-Z0-9]$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async () => {
    if (!formData.fname || !formData.lname || !formData.email || !formData.university_id) {
      setError("Please fill all blanks");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    } else {
      setError(null);
    }

    if (!isValidPassword(formData.password)) {
      setError("Password must be between 8 and 40 characters long, start and end with an alphanumeric character, and may contain special characters like ._@#$%^&");
      return;
    } else {
      setError(null);
    }

    try {
      await axios.post(
        `${APIURL}admins/users`,
        JSON.stringify({
          ...formData,
          sex: formData.sex === 'true',
        }),
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("User added successfully");
      window.location.reload();
      setOpen(false);
      setFormData({
        email: "",
        password: "",
        fname: "",
        lname: "",
        birth_date: "",
        university_id: "",
        sex: "true",
      });
    } catch (error) {
      toast.error("Error adding user");
      console.error("Error adding user:", error);
    }
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add new</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="fname">First Name</Label>
              <div className="mt-1">
                <TextInput
                  id="fname"
                  name="fname"
                  placeholder="John"
                  value={formData.fname}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="lname">Last Name</Label>
              <div className="mt-1">
                <TextInput
                  id="lname"
                  name="lname"
                  placeholder="Doe"
                  value={formData.lname}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="mt-1">
                <TextInput
                  id="email"
                  name="email"
                  placeholder="example@company.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1">
                <TextInput
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="birth_date">Birth Date</Label>
              <div className="mt-1">
                <TextInput
                  id="birth_date"
                  name="birth_date"
                  placeholder="YYYY-MM-DD"
                  type="date"
                  value={formData.birth_date}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="university_id">University</Label>
              <div className="mt-1">
                <Select
                  id="university_id"
                  name="university_id"
                  value={formData.university_id}
                  onChange={handleChange}
                >
                  <option value="">Select a university</option>
                  {universities.map((university) => (
                    <option key={university.id} value={university.id}>
                      {university.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="sex">Sex</Label>
              <div className="mt-1">
                <Select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                >
                  <option value="true">Male</option>
                  <option value="false">Female</option>
                </Select>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={handleSubmit}>
            Add user
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const ImportUserModal: FC = function () {
  const [isOpen, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setError(null);
    setServerMessage("");
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Lütfen bir Excel dosyası (.xlsx / .xls) seçin.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setServerMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${APIURL}admins/users/import/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      const message: string | undefined = res?.data?.message;
      setServerMessage(message ?? "Import completed.");
    } catch (err: any) {
      const apiMsg: string | undefined =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message;
      setError(apiMsg ? String(apiMsg) : "Error importing users");
      console.error("Error importing users:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setError(null);
    setServerMessage("");
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Import
        </div>
      </Button>

      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add .xlsx file</strong>
        </Modal.Header>

        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="user-import-file">Excel File</Label>
              <input
                id="user-import-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={submitting}
                className="mt-1 block w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:file:bg-gray-600 dark:hover:file:bg-gray-500 disabled:cursor-not-allowed"
              />
              {file && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  File: <span className="font-medium">{file.name}</span>
                </p>
              )}
            </div>

            {submitting && (
              <div className="sm:col-span-2">
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                    <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                  Uploading...
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="h-2 w-full animate-pulse rounded-full bg-primary-600/80 dark:bg-primary-500/80" />
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  File is uploading, please wait
                </p>
              </div>
            )}

            {serverMessage && (
              <div className="sm:col-span-2">
                <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200">
                  {serverMessage}
                </div>
              </div>
            )}

            {error && (
              <div className="sm:col-span-2">
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                  {error}
                </div>
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button color="gray" onClick={handleClear} disabled={submitting}>
              Clean
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button color="gray" onClick={() => setOpen(false)} disabled={submitting}>
              Close
            </Button>
            <Button color="primary" onClick={handleSubmit} disabled={submitting || !file}>
              {submitting ? "Uploading..." : "Import User"}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const AllUsersTable: FC = function () {
  const [users, setUsers] = useState<User[]>([]);
  const [universityNames, setUniversityNames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    axios
      .get<User[]>(`${APIURL}admins/users`, {
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
      const response = await axios.get<{ name: string }>(`${APIURL}universities/${universityId}`, {
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

  const handleDeleteUser = (userId: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const handleSex = (sex: boolean): string => {
    return sex ? 'Male' : 'Female';
  };

  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>First Name</Table.HeadCell>
        <Table.HeadCell>Last Name</Table.HeadCell>
        <Table.HeadCell>Birth Date</Table.HeadCell>
        <Table.HeadCell>Sex</Table.HeadCell>
        <Table.HeadCell>Coins</Table.HeadCell>
        <Table.HeadCell>University</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {users.map((user) => (
          <Table.Row key={user.id}>
            <Table.Cell className=" font-medium text-gray-900 dark:text-white">{user.id}</Table.Cell>
            <Table.Cell className=" font-medium text-gray-900 dark:text-white">{user.fname}</Table.Cell>
            <Table.Cell className=" font-medium text-gray-900 dark:text-white">{user.lname}</Table.Cell>
            <Table.Cell className=" font-medium text-gray-900 dark:text-white">{user.birth_date}</Table.Cell>
            <Table.Cell className=" font-medium text-gray-900 dark:text-white">{handleSex(user.sex)}</Table.Cell>
            <Table.Cell className=" font-medium text-gray-900 dark:text-white">{user.coins}</Table.Cell>

            <Table.Cell className=" font-medium text-gray-900 dark:text-white">
              {universityNames[user.university_id] || 'Loading...'}
            </Table.Cell>
            <Table.Cell className=" font-medium text-gray-900 dark:text-white">{user.email}</Table.Cell>

            <Table.Cell className=" font-medium text-gray-900 dark:text-white">
              <div className="flex items-center gap-x-3 whitespace-nowrap">
                <EditUserModal user={user} />
                <DeleteUserModal userId={user.id} onDelete={() => handleDeleteUser(user.id)} />
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

const EditUserModal: FC<{ user: User }> = function ({ user }) {
  const [isOpen, setOpen] = useState(false);
  const [fname, setFName] = useState(user.fname);
  const [lname, setLName] = useState(user.lname);
  const [coins, setCoins] = useState(user.coins);

  const [email, setEmail] = useState(user.email);
  const [university_id, setUniversityId] = useState<string>(user.university_id.toString());
  const [birth_date, setBirthDate] = useState(user.birth_date);
  const [sex, setSex] = useState(user.sex);

  const [universities, setUniversities] = useState<any[]>([]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${APIURL}universities/`, {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        });
        setUniversities(response.data);
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };

    if (isOpen) fetchUniversities();
  }, [isOpen]);

  // ✅ boş field-ları payload-dan silən helper
  const stripEmpty = (obj: Record<string, any>) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => {
        if (v === undefined || v === null) return false;
        if (typeof v === "string" && v.trim() === "") return false;
        return true;
      })
    );
  };

  const handleSave = async () => {
    if (!fname?.trim() || !email?.trim()) {
      setError('Please fill all blanks');
      return;
    }

    setError(null);

    // ✅ burada request payload-u boşları çıxararaq yığırıq
    const payload = stripEmpty({
      fname: fname.trim(),
      lname: lname?.trim(),
      email: email.trim(),
      coins: coins,                 // boşdursa silinəcək
      password: password,           // boşdursa silinəcək (problem həll olur)
      university_id: university_id, // "" olarsa silinəcək
      birth_date: birth_date,       // "" olarsa silinəcək
      sex: sex,                     // boolean qalacaq
    });

    try {
      await axios.put(`${APIURL}admins/users/${user.id}`, payload, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` }
      });

      toast.success('User updated successfully');
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error('Error updating user');
      console.error('Error updating user:', error);
    }
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-2">
          <HiOutlinePencilAlt className="text-lg" />
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edit</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="fname">First Name</Label>
              <TextInput
                id="fname"
                name="fname"
                placeholder="Lucifer"
                value={fname}
                onChange={(e) => setFName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="lname">Last Name</Label>
              <TextInput
                id="lname"
                name="lname"
                placeholder="Lucifer"
                value={lname}
                onChange={(e) => setLName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                name="email"
                placeholder="example@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <TextInput
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Leave empty to keep current password.
              </p>
            </div>

            <div>
              <Label htmlFor="birth_date">Birth Date</Label>
              <TextInput
                id="birth_date"
                name="birth_date"
                type="date"
                value={birth_date}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div className="mt-1">
              <Label htmlFor="university_id">University</Label>
              <div className="mt-1">
                <Select
                  id="university_id"
                  name="university_id"
                  value={university_id}
                  onChange={(e) => setUniversityId(e.target.value)}
                >
                  <option value="">Select University</option>
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.id.toString()}>
                      {uni.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Label>Sex</Label>
              <div className="flex items-center">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="sex"
                    value="true"
                    checked={sex === true}
                    onChange={() => setSex(true)}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="sex"
                    value="false"
                    checked={sex === false}
                    onChange={() => setSex(false)}
                  />
                  Female
                </label>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 mt-3">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={handleSave}>
            Save all
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

interface DeleteUserModalProps {
  userId: number;
  onDelete: () => void;
}
const DeleteUserModal: FC<DeleteUserModalProps> = function ({ userId, onDelete }) {
  const [isOpen, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`${APIURL}admins/users/${userId}`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` }
      });
      toast.success('User deleted successfully');
      onDelete();
      setOpen(false);
    } catch (error) {
      toast.error('Error deleting user');
      console.error('Error deleting user:', error);
    }
  };

  return (
    <>
      <Button color="failure" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-2">
          <HiTrash className="text-lg" />
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-6 pt-6 pb-0">
          <span className="sr-only">Delete user</span>
        </Modal.Header>
        <Modal.Body className="px-6 pt-0 pb-6">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to delete this?
            </p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={handleDelete}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
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
