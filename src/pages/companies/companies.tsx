import {
    Breadcrumb,
    Button,
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
  } from "react-icons/hi";
  import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
  import { Pagination } from "../users/list";
  
  const EcommerceCompaniesPage: FC = function () {
    const [companies, setCompanies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [token, setToken] = useState("");
  
    useEffect(() => {
      const tokenFromCookies = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      setToken(tokenFromCookies || "");
  
      fetch("https://www.telebe360.elxanhuseynli.com/api/companies", {
        headers: {
          Authorization: `Bearer ${tokenFromCookies}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setCompanies(data))
        .catch((error) => console.error("Error fetching companies:", error));
  
      fetch("https://www.telebe360.elxanhuseynli.com/api/categories", {
        headers: {
          Authorization: `Bearer ${tokenFromCookies}`,
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
                <Breadcrumb.Item>Companies</Breadcrumb.Item>
              </Breadcrumb>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                All Companies
              </h1>
            </div>
            <div className="block items-center sm:flex">
              <SearchForCompanies />
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
                <AddCompanyModal token={token} categories={categories} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <CompaniesTable companies={companies} categories={categories} token={token} />
              </div>
            </div>
          </div>
        </div>
        <Pagination />
      </NavbarSidebarLayout>
    );
  };
  
  const SearchForCompanies: FC = function () {
    return (
      <form className="mb-4 sm:mb-0 sm:pr-3" action="#" method="GET">
        <Label htmlFor="companies-search" className="sr-only">
          Search
        </Label>
        <div className="relative mt-1 lg:w-64 xl:w-96">
          <TextInput
            id="companies-search"
            name="companies-search"
            placeholder="Search for companies"
          />
        </div>
      </form>
    );
  };
  
  const AddCompanyModal: FC<{ token: string; categories: any[] }> = function ({ token, categories }) {
    const [isOpen, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [about, setAbout] = useState("");
    const [address, setAddress] = useState("");
  
    const handleAddCompany = () => {
      const formData = new FormData();
      formData.append("name", name);
      if (logo) formData.append("logo", logo);
      if (categoryId) formData.append("categoryId", categoryId.toString());
      formData.append("about", about);
      formData.append("address", address);
  
      fetch("https://www.telebe360.elxanhuseynli.com/api/companies", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          window.location.reload();
          setOpen(false);
        })
        .catch((error) => console.error("Error adding company:", error));
    };
  
    return (
      <>
        <Button color="primary" onClick={() => setOpen(!isOpen)}>
          <FaPlus className="mr-3 text-sm" />
          Add Company
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Add Company</strong>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <TextInput
                    id="companyName"
                    name="companyName"
                    placeholder="Company Name"
                    className="mt-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="companyLogo">Logo</Label>
                  <TextInput
                    id="companyLogo"
                    name="companyLogo"
                    type="file"
                    className="mt-1"
                    onChange={(e) => setLogo(e.target.files ? e.target.files[0] : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="companyCategory">Category</Label>
                  <select
                    id="companyCategory"
                    name="companyCategory"
                    className="mt-1 dark:bg-gray-800 dark:text-white"
                    onChange={(e) => setCategoryId(parseInt(e.target.value))}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id} className="dark:bg-gray-800 dark:text-white">
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="lg:col-span-2">
                  <Label htmlFor="companyAbout">About</Label>
                  <Textarea
                    id="companyAbout"
                    name="companyAbout"
                    placeholder="About the Company"
                    className="mt-1"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </div>
                <div className="lg:col-span-2">
                  <Label htmlFor="companyAddress">Address</Label>
                  <TextInput
                    id="companyAddress"
                    name="companyAddress"
                    placeholder="Company Address"
                    className="mt-1"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button color="primary" onClick={handleAddCompany}>
              Add Company
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  
  const EditCompanyModal: FC<{ token: string; company: any; categories: any[] }> = function ({
    token,
    company,
    categories,
  }) {
    const [isOpen, setOpen] = useState(false);
    const [name, setName] = useState(company.name);
    const [logo, setLogo] = useState<File | null>(null);
    const [categoryId, setCategoryId] = useState(company.categoryId);
    const [about, setAbout] = useState(company.about);
    const [address, setAddress] = useState(company.address);
  
    const handleEditCompany = () => {
      const formData = new FormData();
      formData.append("name", name);
      if (logo) formData.append("logo", logo);
      formData.append("categoryId", categoryId.toString());
      formData.append("about", about);
      formData.append("address", address);
  
      fetch(`https://www.telebe360.elxanhuseynli.com/api/companies/${company.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          window.location.reload();
          setOpen(false);
        })
        .catch((error) => console.error("Error editing company:", error));
    };
  
    return (
      <>
        <Button color="primary" onClick={() => setOpen(!isOpen)}>
          <HiPencilAlt className="text-lg" />
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Edit Company</strong>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <TextInput
                    id="companyName"
                    name="companyName"
                    placeholder="Company Name"
                    className="mt-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="companyLogo">Logo</Label>
                  <TextInput
                    id="companyLogo"
                    name="companyLogo"
                    type="file"
                    className="mt-1"
                    onChange={(e) => setLogo(e.target.files ? e.target.files[0] : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="companyCategory">Category</Label>
                  <select
                    id="companyCategory"
                    name="companyCategory"
                    className="mt-1 dark:bg-gray-800 dark:text-white"
                    value={categoryId}
                    onChange={(e) => setCategoryId(parseInt(e.target.value))}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id} className="dark:bg-gray-800 dark:text-white">
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="lg:col-span-2">
                  <Label htmlFor="companyAbout">About</Label>
                  <Textarea
                    id="companyAbout"
                    name="companyAbout"
                    placeholder="About the Company"
                    className="mt-1 h-36"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </div>
                <div className="lg:col-span-2">
                  <Label htmlFor="companyAddress">Address</Label>
                  <TextInput
                    id="companyAddress"
                    name="companyAddress"
                    placeholder="Company Address"
                    className="mt-1"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button color="primary" onClick={handleEditCompany}>
              Edit Company
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  
  const DeleteCompanyModal: FC<{ token: string; companyId: number }> = function ({ token, companyId }) {
    const [isOpen, setOpen] = useState(false);
  
    const handleDeleteCompany = () => {
      fetch(`https://www.telebe360.elxanhuseynli.com/api/companies/${companyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            setOpen(false);
            window.location.reload();
          } else {
            console.error("Error deleting company");
          }
        })
        .catch((error) => console.error("Error deleting company:", error));
    };
  
    return (
      <>
        <Button color="failure" onClick={() => setOpen(!isOpen)}>
          <HiTrash className="text-lg" />
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Delete Company</strong>
          </Modal.Header>
          <Modal.Body>
            <p className='dark:text-white'>Are you sure you want to delete this Company?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button color="failure" onClick={handleDeleteCompany}>
              Delete Company
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  
  const CompaniesTable: FC<{ companies: any[]; categories: any[]; token: string  }> = function ({ companies,categories,token,}) {
      const [categoryNames, setCategoryNames] = useState<{ [key: number]: string }>({});
      useEffect(() => {
        const fetchCategoryName = async (id: number) => {
          try {
            const response = await fetch(`https://www.telebe360.elxanhuseynli.com/api/categories/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setCategoryNames((prev) => ({ ...prev, [id]: data.name }));
          } catch (error) {
            console.error("Error fetching category name:", error);
          }
        };
    
        companies.forEach((company) => {
          if (company.categoryId && !categoryNames[company.categoryId]) {
            fetchCategoryName(company.categoryId);
          }
        });
      }, [companies, token]);
    
    return (
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <Table.Head>
          <Table.HeadCell>ID</Table.HeadCell>
          <Table.HeadCell>Company Name</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Logo</Table.HeadCell>
          <Table.HeadCell>Address</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
          {companies.map((company) => (
            <Table.Row key={company.id} className="bg-white dark:bg-gray-800 ">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {company.id}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white ">
                {company.name}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {categoryNames[company.categoryId] || "Loading..."}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {company.logo ? (
                  <img src={`https://telebe360.elxanhuseynli.com/storage/images/logos/${company.logo}`} alt={company.name} className=" h-8 w-8 object-contain rounded-full" />
                ) : (
                  "No Logo"
                )}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {company.address}
              </Table.Cell>
             
              <Table.Cell>
                <div className="flex items-center space-x-4">
                  <EditCompanyModal token={token} company={company} categories={categories} />
                  <DeleteCompanyModal token={token} companyId={company.id} />
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  };
  
  
  export default EcommerceCompaniesPage;
  