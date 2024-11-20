import {
  Breadcrumb,
  Button,
  Checkbox,
  Label,
  Modal,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import type { FC } from "react";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import {
  HiCog,
  HiDotsVertical,
  HiExclamationCircle,
  HiHome,
  HiOutlineExclamationCircle,
  HiPencilAlt,
  HiTrash,
  HiUpload,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { Pagination } from "../users/list";
import {APIURL,MAINURL} from '../../utils/constants'
const EcommerceCategoriesPage: FC = function () {
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState(""); // Store the token

  useEffect(() => {
    // Assuming token is stored in cookies
    const tokenFromCookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    setToken(tokenFromCookies || "");

    fetch(`${APIURL}universities/`, {
      headers: {
        Authorization: `Bearer ${tokenFromCookies}`, // Attach token
      },
    })
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

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
              <Breadcrumb.Item href="/university">E-commerce</Breadcrumb.Item>
              <Breadcrumb.Item>Categories</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All Universities
            </h1>
          </div>
          <div className="block items-center sm:flex">
            <SearchForCategories />
            <div className="hidden space-x-1 border-l border-gray-100 pl-2 dark:border-gray-700 md:flex">
              <a
                href="#"
                className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Configure</span>
                <HiCog className="text-2xl" />
              </a>
              <a
                href="#"
                className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Delete</span>
                <HiTrash className="text-2xl" />
              </a>
              <a
                href="#"
                className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Purge</span>
                <HiExclamationCircle className="text-2xl" />
              </a>
              <a
                href="#"
                className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Settings</span>
                <HiDotsVertical className="text-2xl" />
              </a>
            </div>
            <div className="flex w-full items-center sm:justify-end">
              <AddCategoryModal token={token} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <CategoriesTable categories={categories} token={token} />
            </div>
          </div>
        </div>
      </div>
      <Pagination />
    </NavbarSidebarLayout>
  );
};

const SearchForCategories: FC = function () {
  return (
    <form className="mb-4 sm:mb-0 sm:pr-3" action="#" method="GET">
      <Label htmlFor="categories-search" className="sr-only">
        Search
      </Label>
      <div className="relative mt-1 lg:w-64 xl:w-96">
        <TextInput
          id="categories-search"
          name="categories-search"
          placeholder="Search for categories"
        />
      </div>
    </form>
  );
};

const AddCategoryModal: FC<{ token: string }> = function ({ token }) {
  const [isOpen, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleAddCategory = () => {
    fetch(`${APIURL}universities/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload();
        setOpen(false);
        // Refresh the page or update the state to reflect the new category
      })
      .catch((error) => console.error("Error adding category:", error));
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Add University
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add University</strong>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="CategoryName">University name</Label>
                <TextInput
                  id="CategoryName"
                  name="CategoryName"
                  placeholder="University Name"
                  className="mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {/* Other fields can be added here if necessary */}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={handleAddCategory}>
            Add University
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const EditCategoryModal: FC<{ token: string; category: any }> = function ({
  token,
  category,
}) {
  const [isOpen, setOpen] = useState(false);
  const [name, setName] = useState(category.name);

  const handleEditCategory = () => {
    fetch(
      `${APIURL}universities/${category.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        window.location.reload();
        setOpen(false);
        // Refresh the page or update the state to reflect the updated category
      })
      .catch((error) => console.error("Error editing category:", error));
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <HiPencilAlt className="text-lg" />
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edit University</strong>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="productName">University name</Label>
                <TextInput
                  id="productName"
                  name="productName"
                  placeholder="Category Name"
                  className="mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {/* Other fields can be added here if necessary */}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={handleEditCategory}>
            Edit University
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const DeleteCategoryModal: FC<{ token: string; categoryId: number }> = function ({
  token,
  categoryId,
}) {
  const [isOpen, setOpen] = useState(false);

  const handleDeleteCategory = () => {
    fetch(`${APIURL}universities/${categoryId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setOpen(false);
        window.location.reload();

          // Refresh the page or update the state to reflect the deletion
        } else {
          console.error("Error deleting category");
        }
      })
      .catch((error) => console.error("Error deleting category:", error));
  };

  return (
    <>
      <Button color="failure" onClick={() => setOpen(!isOpen)}>
        <HiTrash className="text-lg" />
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Delete University</strong>
        </Modal.Header>
        <Modal.Body>
          <p className='dark:text-white'>Are you sure you want to delete this University?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleDeleteCategory}>
            Delete University
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const CategoriesTable: FC<{ categories: any[]; token: string }> = function ({
  categories,
  token,
}) {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <Table.Head>
      <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>University name</Table.HeadCell>
        <Table.HeadCell>Action</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
        {categories.map((category) => (
          <Table.Row key={category.id} className="bg-white dark:bg-gray-800">
             <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {category.id}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {category.name}
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center space-x-4">
                <EditCategoryModal token={token} category={category} />
                <DeleteCategoryModal token={token} categoryId={category.id} />
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default EcommerceCategoriesPage;
