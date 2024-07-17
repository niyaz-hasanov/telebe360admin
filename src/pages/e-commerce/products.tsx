import {
  Breadcrumb,
  Button,
  Label,
  Modal,
  Table,
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
  HiPencilAlt,
  HiTrash,
  HiUpload,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { Pagination } from "../users/list";

const EcommerceCategoriessPage: FC = function () {
  const [categories, setCategories] = useState([]);

  const getToken = () => {
    return document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  };

  useEffect(() => {
    fetch("https://www.telebe360.elxanhuseynli.com/api/categories", {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      }
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
              <Breadcrumb.Item href="/categories">
                E-commerce
              </Breadcrumb.Item>
              <Breadcrumb.Item>Categories</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All Categories
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
              <AddCategoryModal getToken={getToken} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <CategoriesTable categories={categories} getToken={getToken} />
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

const AddCategoryModal: FC<{ getToken: () => string }> = function ({ getToken }) {
  const [isOpen, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIcon(e.target.files[0]);
    }
  };

  const handleAddCategory = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    if (icon) {
      formData.append('icon', icon);
    }

    fetch("https://www.telebe360.elxanhuseynli.com/api/categories", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log("Category added:", data);
        window.location.reload();
        setOpen(false);
        // Refresh categories list or handle the state update
      })
      .catch(error => console.error("Error adding category:", error));
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Add Category
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add Category</strong>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="CategoryName">Category name</Label>
                <TextInput
                  id="CategoryName"
                  name="CategoryName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <TextInput
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Enter slug"
                  className="mt-1"
                />
              </div>
              <div className="lg:col-span-2">
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-32 w-full cursor-pointer flex-col rounded border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <HiUpload className="text-4xl text-gray-300" />
                      <p className="py-1 text-sm text-gray-600 dark:text-gray-500">
                        Upload a file or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={handleAddCategory}>
            Add Category
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const EditCategoryModal: FC<{ category: any, getToken: () => string }> = function ({ category, getToken }) {
  const [isOpen, setOpen] = useState(false);
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [icon, setIcon] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIcon(e.target.files[0]);
    }
  };

  const handleEditCategory = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    if (icon) {
      formData.append('icon', icon);
    }

    fetch(`https://www.telebe360.elxanhuseynli.com/api/categories/${category.id}`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log("Category edited:", data);
        window.location.reload();
        setOpen(false);
        // Refresh categories list or handle the state update
      })
      .catch(error => console.error("Error editing category:", error));
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <HiPencilAlt className="" />
        
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edit Category</strong>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="CategoryName">Category name</Label>
                <TextInput
                  id="CategoryName"
                  name="CategoryName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <TextInput
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Enter slug"
                  className="mt-1"
                />
              </div>
              <div className="lg:col-span-2">
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-32 w-full cursor-pointer flex-col rounded border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <HiUpload className="text-4xl text-gray-300" />
                      <p className="py-1 text-sm text-gray-600 dark:text-gray-500">
                        Upload a file or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={handleEditCategory}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const CategoriesTable: FC<{ categories: any[], getToken: () => string }> = function ({ categories, getToken }) {
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteCategory = (category: any) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (selectedCategory) {
      fetch(`https://www.telebe360.elxanhuseynli.com/api/categories/${selectedCategory.id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        }
      })
        .then(response => response.json() &&
        window.location.reload()
            
      )
        .then(data => {
          console.log("Category deleted:", data);
          window.location.reload(); // veya kategori listesini güncelleme işlemi
          setDeleteModalOpen(false);
        })
        .catch(error => console.error("Error deleting category:", error));
    }
  };

  return (
    <>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <Table.Head className="bg-gray-100 dark:bg-gray-700">
          <Table.HeadCell>ID</Table.HeadCell>
          <Table.HeadCell>Category name</Table.HeadCell>
          <Table.HeadCell>Slug</Table.HeadCell>
          <Table.HeadCell>Icon</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {categories.map((category) => (
            <Table.Row key={category.id} className="bg-white dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {category.id}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {category.name}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {category.slug}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <img src={`https://telebe360.elxanhuseynli.com/storage/images/icons/${category.icon}`} alt={category.name} className="h-8 w-8 object-contain dark:bg-white " />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-4">
                  <EditCategoryModal category={category} getToken={getToken} />
                  <Button color="failure" onClick={() => handleDeleteCategory(category)}>
                    <HiTrash className="" />
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      
      {selectedCategory && (
        <Modal show={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Confirm Delete</strong>
          </Modal.Header>
          <Modal.Body>
           <p className="dark:text-white"> Are you sure you want to delete the category "{selectedCategory.name}"?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button color="failure" onClick={confirmDeleteCategory}>
              Confirm
            </Button>
            <Button color="gray" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};


export default EcommerceCategoriessPage;
