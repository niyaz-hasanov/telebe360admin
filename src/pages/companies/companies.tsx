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
import {APIURL,MAINURL} from '../../utils/constants'

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

    fetch(`${APIURL}companies/`, {
      headers: {
        Authorization: `Bearer ${tokenFromCookies}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCompanies(data))
      .catch((error) => console.error("Error fetching companies:", error));

    fetch(`${APIURL}categories/`, {
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
  const [categoryId, setCategoryId] = useState<string | null>(null); // UUID string olarak kullanılacak
  const [about, setAbout] = useState(""); // 'about' yerine 'description' kullanılacak
  const [address, setAddress] = useState("");

  const handleAddCompany = () => {
    const formData = new FormData();
    formData.append("name", name);
    if (logo) formData.append("logo", logo); // Logo dosyasını binary formatta ekle
    if (categoryId) formData.append("category_id", categoryId); // categoryId string UUID olarak gönderilecek
    formData.append("description", about); // 'about' alanı 'description' olarak gönderilecek
    formData.append("address", address);

    fetch(`${APIURL}companies/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload(); // Başarılı POST işlemi sonrası sayfayı yenile
        setOpen(false); // Modal'ı kapat
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
                  className="mt-1 w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
                  onChange={(e) => setCategoryId(e.target.value)} // categoryId artık string olacak
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
                <Label htmlFor="companyAbout">Description</Label>
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

interface Category {
  id: number;
  name: string;
}

interface Company {
  id: number;
  name: string;
  logo_path?: string;
  category?: Category;
  description: string;
  address: string;
}

interface EditCompanyModalProps {
  token: string;
  company: Company;
  categories: Category[];
}

const EditCompanyModal: FC<EditCompanyModalProps> = ({ token, company, categories }) => {
  const [isOpen, setOpen] = useState(false);
  const [name, setName] = useState(company.name);
  const [logo, setLogo] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState(company?.category?.id || '');
  const [description, setDescription] = useState(company.description);
  const [address, setAddress] = useState(company.address);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(company.name);
    setCategoryId(company.category?.id);
    setDescription(company.description);
    setAddress(company.address);
    setLogo(null); // Logo sıfırlanabilir veya mevcut logoyu korumak için değiştirilebilir
    setError(null); // Önceki hataları temizle
  }, [company]);
  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
  };
  const handleEditCompany = async () => {
    setError(null); // Önceki hataları temizle
   
    const updatedCompany = {
      ...company,
      category_id: categoryId,
    };
    // Kategori seçimini doğrula


    // Şirket adını doğrula
    if (!name.trim()) {
      setError("Şirket adı boş olamaz.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    if (logo) formData.append("logo", logo);
    formData.append("category_id", categoryId.toString()); // categoryId'yi string olarak gönderiyoruz
    formData.append("description", description);
    formData.append("address", address);

    try {
      const response = await fetch(`${APIURL}companies/${company.id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Şirketi düzenlerken bir hata oluştu.");
      }

      window.location.reload();
      setOpen(false);
    } catch (err) {
      console.error("Error editing company:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Şirketi düzenlerken bilinmeyen bir hata oluştu.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
              {/* Şirket Adı */}
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

              {/* Logo Yükleme */}
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

              {/* Kategori Seçimi */}
              <div>
                <Label htmlFor="companyCategory">Category</Label>
                <select value={categoryId} onChange={handleCategoryChange} className="mt-1 w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white">
                  <option value="">Kategori Seçiniz</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Açıklama */}
              <div className="lg:col-span-2">
                <Label htmlFor="companyDescription">Description</Label>
                <Textarea
                  id="companyDescription"
                  name="companyDescription"
                  placeholder="Description of the Company"
                  className="mt-1 h-36"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Adres */}
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
          {/* Hata Mesajı */}
          {error && <div className="mt-4 text-red-500">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button color="secondary" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleEditCompany} disabled={isSubmitting}>
            {isSubmitting ? "Editing..." : "Edit Company"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
const DeleteCompanyModal: FC<{ token: string; companyId: number }> = function ({ token, companyId }) {
  const [isOpen, setOpen] = useState(false);

  const handleDeleteCompany = () => {
    fetch(`${APIURL}companies/${companyId}/`, {
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

const CompaniesTable: FC<{ companies: any[]; categories: any[]; token: string }> = function ({ companies, categories, token, }) {
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
              {company.category?.name || 'No Category'}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {company.logo_path ? (
                <img src={`${MAINURL}uploads/${company.logo_path}/`} alt={company.name} className=" h-8 w-8 object-contain rounded-full" />
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
