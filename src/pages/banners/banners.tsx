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
      fetch("https://www.telebe360.elxanhuseynli.com/api/banners", {
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
                <Breadcrumb.Item href="/banners">
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
    const [type, setType] = useState(''); // type now a string to handle '0' and '1'
    const [imgDesktop, setImgDesktop] = useState<File | null>(null);
    const [imgMobile, setImgMobile] = useState<File | null>(null);
    const [previewDesktop, setPreviewDesktop] = useState<string | null>(null);
    const [previewMobile, setPreviewMobile] = useState<string | null>(null);
  
    const handleFileChangeDesktop = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileChange(e, 'desktop');
    };
  
    const handleFileChangeMobile = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileChange(e, 'mobile');
    };
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (type === 'desktop') {
          setImgDesktop(file);
  
          // Preview image
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewDesktop(reader.result as string);
          };
          reader.readAsDataURL(file);
        } else if (type === 'mobile') {
          setImgMobile(file);
  
          // Preview image
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewMobile(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    };
  
    const handleAddCategory = () => {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('type', type === 'Up' ? '0' : '1'); // map 'Up' to '0' and 'Down' to '1'
  
      if (imgDesktop && imgMobile) {
        formData.append('imgDesktop', imgDesktop);
        formData.append('imgMobile', imgMobile);
      }
  
      fetch("https://www.telebe360.elxanhuseynli.com/api/banners", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log("banner added:", data);
          window.location.reload(); // Reloads the page, consider alternative state management if possible
          setOpen(false);
          // Refresh categories list or handle the state update
        })
        .catch(error => console.error("Error adding banner:", error));
    };
  
    return (
      <>
        <Button color="primary" onClick={() => setOpen(!isOpen)}>
          <FaPlus className="mr-3 text-sm" />
          Add banner
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 dark:border-gray-700 p-6">
            <strong>Add banner</strong>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <Label htmlFor="bannerName">banner name</Label>
                  <TextInput
                    id="bannerName"
                    name="bannerName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter banner name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-gray-500 dark:focus:border-gray-500"
                  >
                    <option value="">Select type</option>
                    <option value="Up">Up</option>
                    <option value="Down">Down</option>
                  </select>
                </div>
                <div className="lg:col-span-2">
                    <Label> Desktop banner</Label>
                  <div className="flex w-full items-center justify-center">
                    <label className="flex h-32 w-full cursor-pointer flex-col rounded border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
                      {previewDesktop && (
                        <img src={previewDesktop} alt="Desktop Preview" className="h-32 w-full object-cover" />
                      )}
                      {!previewDesktop && (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <HiUpload className="text-4xl text-gray-300" />
                          <p className="py-1 text-sm text-gray-600 dark:text-gray-500">
                            Upload a file or drag and drop for Desktop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                      <input type="file" className="hidden" onChange={handleFileChangeDesktop} />
                    </label>
                  </div>
                </div>
                <div className="lg:col-span-2">
                <Label>Mobile banner</Label>
                  <div className="flex w-full items-center justify-center">
                    <label className="flex h-32 w-full cursor-pointer flex-col rounded border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
                      {previewMobile && (
                        <img src={previewMobile} alt="Mobile Preview" className="h-32 w-full object-cover" />
                      )}
                      {!previewMobile && (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <HiUpload className="text-4xl text-gray-300" />
                          <p className="py-1 text-sm text-gray-600 dark:text-gray-500">
                            Upload a file or drag and drop for Mobile
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                      <input type="file" className="hidden" onChange={handleFileChangeMobile} />
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer className="border-t border-gray-200 dark:border-gray-700">
            <Button color="primary" onClick={handleAddCategory}>
              Add banner
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  
  
  const EditCategoryModal: FC<{ category: any, getToken: () => string }> = function ({ category, getToken }) {
    const [isOpen, setOpen] = useState(false);
    const [name, setName] = useState(category.name);
    const [type, setType] = useState(category.type === '0' ? 'Up' : 'Down'); // map '0' to 'Up' and '1' to 'Down'
    const [imgDesktop, setImgDesktop] = useState<File | null>(null);
    const [imgMobile, setImgMobile] = useState<File | null>(null);
    const [previewDesktop, setPreviewDesktop] = useState<string | null>(category.imgDesktop ? `https://telebe360.elxanhuseynli.com/storage/images/banners/${category.imgDesktop}` : null);
    const [previewMobile, setPreviewMobile] = useState<string | null>(category.imgMobile ? `https://telebe360.elxanhuseynli.com/storage/images/banners/${category.imgMobile}` : null);
  
    useEffect(() => {
      setName(category.name);
      setType(category.type === '0' ? 'Up' : 'Down');
      setPreviewDesktop(category.imgDesktop ? `https://telebe360.elxanhuseynli.com/storage/images/banners/${category.imgDesktop}` : null);
      setPreviewMobile(category.imgMobile ? `https://telebe360.elxanhuseynli.com/storage/images/banners/${category.imgMobile}` : null);
    }, [category]);
  
    const handleFileChangeDesktop = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileChange(e, 'desktop');
    };
  
    const handleFileChangeMobile = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileChange(e, 'mobile');
    };
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (type === 'desktop') {
          setImgDesktop(file);
  
          // Preview image
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewDesktop(reader.result as string);
          };
          reader.readAsDataURL(file);
        } else if (type === 'mobile') {
          setImgMobile(file);
  
          // Preview image
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewMobile(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    };
  
    const handleEditCategory = () => {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('type', type === 'Up' ? '0' : '1'); // map 'Up' to '0' and 'Down' to '1'
  
      if (imgDesktop) {
        formData.append('imgDesktop', imgDesktop);
      }
  
      if (imgMobile) {
        formData.append('imgMobile', imgMobile);
      }
  
      fetch(`https://www.telebe360.elxanhuseynli.com/api/banners/${category.id}`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log("banner edited:", data);
          window.location.reload(); // Reloads the page, consider alternative state management if possible
          setOpen(false);
          // Refresh categories list or handle the state update
        })
        .catch(error => console.error("Error editing banner:", error));
    };
  
    return (
      <>
        <Button color="primary" onClick={() => setOpen(!isOpen)}>
          <HiPencilAlt className="text-sm" />
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 dark:border-gray-700 p-6">
            <strong>Edit banner</strong>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <Label htmlFor="bannerName">banner name</Label>
                  <TextInput
                    id="bannerName"
                    name="bannerName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter banner name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-gray-500 dark:focus:border-gray-500"
                  >
                    <option value="">Select type</option>
                    <option value="Up">Up</option>
                    <option value="Down">Down</option>
                  </select>
                </div>
                <div className="lg:col-span-2">
                <Label> Desktop banner</Label>
                  <div className="flex w-full items-center justify-center">
                    <label className="flex h-32 w-full cursor-pointer flex-col rounded border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
                      {previewDesktop && (
                        <img src={previewDesktop} alt="Desktop Preview" className="h-32 w-full object-cover" />
                      )}
                      {!previewDesktop && (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <HiUpload className="text-4xl text-gray-300" />
                          <p className="py-1 text-sm text-gray-600 dark:text-gray-500">
                            Upload a file or drag and drop for Desktop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                      <input type="file" className="hidden" onChange={handleFileChangeDesktop} />
                    </label>
                  </div>
                </div>
                <div className="lg:col-span-2">
                <Label> Mobile banner</Label>
                  <div className="flex w-full items-center justify-center">
                    <label className="flex h-32 w-full cursor-pointer flex-col rounded border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
                      {previewMobile && (
                        <img src={previewMobile} alt="Mobile Preview" className="h-32 w-full object-cover" />
                      )}
                      {!previewMobile && (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <HiUpload className="text-4xl text-gray-300" />
                          <p className="py-1 text-sm text-gray-600 dark:text-gray-500">
                            Upload a file or drag and drop for Mobile
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                      <input type="file" className="hidden" onChange={handleFileChangeMobile} />
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer className="border-t border-gray-200 dark:border-gray-700">
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
    const [isImageModalOpen, setImageModalOpen] = useState(false);
    const [imageToPreview, setImageToPreview] = useState<string | null>(null);
  
    const handleDeleteCategory = (category: any) => {
      setSelectedCategory(category);
      setDeleteModalOpen(true);
    };
  
    const confirmDeleteCategory = () => {
      if (selectedCategory) {
        fetch(`https://www.telebe360.elxanhuseynli.com/api/banners/${selectedCategory.id}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${getToken()}`,
          }
        })
          .then(response => {
            window.location.reload();
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log("Banner deleted:", data);
            // veya kategori listesini güncelleme işlemi
            setDeleteModalOpen(false);
          })
          .catch(error => console.error("Error deleting banner:", error));
      } else {
        console.error("No selected category to delete");
      }
    };
  
    const handleImageClick = (imageUrl: string) => {
      setImageToPreview(imageUrl);
      setImageModalOpen(true);
    };
  
    return (
      <>
        <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <Table.Head className="bg-gray-100 dark:bg-gray-700">
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Banner name</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Desktop Icon</Table.HeadCell>
            <Table.HeadCell>Mobile Icon</Table.HeadCell>
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
                  {category.type === '0' ? 'Up' : 'Down'}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <img 
                    src={`https://telebe360.elxanhuseynli.com/storage/images/banners/${category.imgDesktop}`} 
                    alt={category.name} 
                    className="h-16 w-16 object-contain dark:bg-white cursor-pointer" 
                    onClick={() => handleImageClick(`https://telebe360.elxanhuseynli.com/storage/images/banners/${category.imgDesktop}`)}
                  />
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <img 
                    src={`https://telebe360.elxanhuseynli.com/storage/images/banners/${category.imgMobile}`} 
                    alt={category.name} 
                    className="h-16 w-16 object-contain dark:bg-white cursor-pointer" 
                    onClick={() => handleImageClick(`https://telebe360.elxanhuseynli.com/storage/images/banners/${category.imgMobile}`)}
                  />
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
              <p className="dark:text-white"> Are you sure you want to delete the banner "{selectedCategory.name}"?</p>
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
  
  
  export default EcommerceCategoriessPage;
  