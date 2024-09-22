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
  
  const TicketsPage: FC = function () {
    const [tickets, setTickets] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [token, setToken] = useState("");
  
    useEffect(() => {
      const tokenFromCookies = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      setToken(tokenFromCookies || "");
  
      fetch("http://209.38.40.216:8000/api/v1/tickets", {
        headers: {
          Authorization: `Bearer ${tokenFromCookies}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setTickets(data))
        .catch((error) => console.error("Error fetching tickets:", error));
  
      fetch("http://209.38.40.216:8000/api/v1/companies", {
        headers: {
          Authorization: `Bearer ${tokenFromCookies}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setCompanies(data))
        .catch((error) => console.error("Error fetching companies:", error));
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
                <Breadcrumb.Item href="/ecommerce">E-commerce</Breadcrumb.Item>
                <Breadcrumb.Item>Tickets</Breadcrumb.Item>
              </Breadcrumb>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                All Tickets
              </h1>
            </div>
            <div className="block items-center sm:flex">
              <SearchForTickets />
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
                <AddTicketModal token={token} companies={companies} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <TicketsTable tickets={tickets} companies={companies} token={token} />
              </div>
            </div>
          </div>
        </div>
        <Pagination />
      </NavbarSidebarLayout>
    );
  };
  
  const SearchForTickets: FC = function () {
    return (
      <form className="mb-4 sm:mb-0 sm:pr-3" action="#" method="GET">
        <Label htmlFor="tickets-search" className="sr-only">
          Search
        </Label>
        <div className="relative mt-1 lg:w-64 xl:w-96">
          <TextInput
            id="tickets-search"
            name="tickets-search"
            placeholder="Search for tickets"
          />
        </div>
      </form>
    );
  };
  
  const AddTicketModal: FC<{ token: string; companies: any[] }> = function ({ token, companies }) {
    const [isOpen, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [count, setCount] = useState("");
    const [discountPercent, setDiscountPercent] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [companyId, setCompanyId] = useState<number | null>(null);
  
    const handleAddTicket = () => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("count", count);
      formData.append("discountPercent", discountPercent);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("companyId", companyId ? companyId.toString() : "");
  
      fetch("http://209.38.40.216:8000/api/v1/tickets", {
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
        .catch((error) => console.error("Error adding ticket:", error));
    };
  
    return (
      <>
        <Button color="primary" onClick={() => setOpen(!isOpen)}>
          <FaPlus className="mr-3 text-sm" />
          Add Ticket
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Add Ticket</strong>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <Label htmlFor="ticketName">Ticket Name</Label>
                  <TextInput
                    id="ticketName"
                    name="ticketName"
                    placeholder="Ticket Name"
                    className="mt-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ticketCount">Count</Label>
                  <TextInput
                    id="ticketCount"
                    name="ticketCount"
                    placeholder="Count"
                    className="mt-1"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ticketDiscountPercent">Discount Percent</Label>
                  <TextInput
                    id="ticketDiscountPercent"
                    name="ticketDiscountPercent"
                    placeholder="Discount Percent"
                    className="mt-1"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ticketStartDate">Start Date</Label>
                  <TextInput
                    id="ticketStartDate"
                    name="ticketStartDate"
                    type="date"
                    className="mt-1"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ticketEndDate">End Date</Label>
                  <TextInput
                    id="ticketEndDate"
                    name="ticketEndDate"
                    type="date"
                    className="mt-1"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ticketCompanyId">Company</Label>
                  <select
                    id="ticketCompanyId"
                    name="ticketCompanyId"
                    className="dark:bg-gray-800 dark:text-white mt-1 w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    value={companyId ? companyId.toString() : ""}
                    onChange={(e) => setCompanyId(parseInt(e.target.value))}
                  >
                    <option value="">Select a company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end space-x-2">
              <Button color="gray" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleAddTicket}>
                Add Ticket
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  
  const EditTicketModal: FC<{ token: string; companies: any[]; ticket: any }> = function ({
    token,
    companies,
    ticket,
  }) {
    const [isOpen, setOpen] = useState(false);
    const [name, setName] = useState(ticket.name);
    const [count, setCount] = useState(ticket.count);
    const [discountPercent, setDiscountPercent] = useState(ticket.discountPercent);
    const [startDate, setStartDate] = useState(ticket.startDate);
    const [endDate, setEndDate] = useState(ticket.endDate);
    const [companyId, setCompanyId] = useState(ticket.companyId);
  
    const handleEditTicket = () => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("count", count);
      formData.append("discountPercent", discountPercent);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("companyId", companyId ? companyId.toString() : "");
  
      fetch(`http://209.38.40.216:8000/api/v1/tickets/${ticket.id}`, {
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
        .catch((error) => console.error("Error editing ticket:", error));
    };
  
    return (
      <>
        <Button color="primary" onClick={() => setOpen(!isOpen)}>
          <HiPencilAlt className=" text-sm" />
       
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Edit Ticket</strong>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <Label htmlFor="ticketName">Ticket Name</Label>
                  <TextInput
                    id="ticketName"
                    name="ticketName"
                    placeholder="Ticket Name"
                    className="mt-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ticketCount">Count</Label>
                  <TextInput
                    id="ticketCount"
                    name="ticketCount"
                    placeholder="Count"
                    className="mt-1"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ticketDiscountPercent">Discount Percent</Label>
                  <TextInput
                    id="ticketDiscountPercent"
                    name="ticketDiscountPercent"
                    placeholder="Discount Percent"
                    className="mt-1"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ticketStartDate">Start Date</Label>
                  <TextInput
                    id="ticketStartDate"
                    name="ticketStartDate"
                    type="date"
                    className="mt-1"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ticketEndDate">End Date</Label>
                  <TextInput
                    id="ticketEndDate"
                    name="ticketEndDate"
                    type="date"
                    className="mt-1"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ticketCompanyId">Company</Label>
                  <select
                    id="ticketCompanyId"
                    name="ticketCompanyId"
                    className="mt-1 w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
                    value={companyId ? companyId.toString() : ""}
                    onChange={(e) => setCompanyId(parseInt(e.target.value))}
                  >
                    <option value="">Select a company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end space-x-2">
              <Button color="gray" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleEditTicket}>
                Save
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  
  const DeleteTicketModal: FC<{ token: string; ticket: any }> = function ({ token, ticket }) {
    const [isOpen, setOpen] = useState(false);
  
    const handleDeleteTicket = () => {
      fetch(`http://209.38.40.216:8000/api/v1/tickets/${ticket.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json() &&  window.location.reload())
        .then((data) => {
          window.location.reload();
          setOpen(false);
        })
        .catch((error) => console.error("Error deleting ticket:", error));
    };
  
    return (
      <>
        <Button color="failure" onClick={() => setOpen(!isOpen)}>
          <HiTrash className="text-sm" />
       
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Delete Ticket</strong>
          </Modal.Header>
          <Modal.Body>
            <p className="dark:text-white">Are you sure you want to delete this ticket?</p>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end space-x-2">
              <Button color="gray" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button color="failure" onClick={handleDeleteTicket}>
                Delete
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  
  const TicketsTable: FC<{ tickets: any[]; companies: any[]; token: string }> = function ({ companies, tickets, token }) {
  
  
    return (
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>ID</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Count</Table.HeadCell>
          <Table.HeadCell>Discount Percent</Table.HeadCell>
          <Table.HeadCell>Start Date</Table.HeadCell>
          <Table.HeadCell>End Date</Table.HeadCell>
          <Table.HeadCell>Company</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="bg-white dark:bg-gray-800 dark:text-white">
          {tickets.map((ticket) => (
            <Table.Row key={ticket.id}>
                 <Table.Cell>{ticket.id}</Table.Cell>
              <Table.Cell>{ticket.name}</Table.Cell>
              <Table.Cell>{ticket.count}</Table.Cell>
              <Table.Cell >{ticket.discount}</Table.Cell>
              <Table.Cell>{ticket.start_time}</Table.Cell>
              <Table.Cell>{ticket.end_time}</Table.Cell>
              <Table.Cell>
               {ticket.company.name}
              </Table.Cell>
              <Table.Cell>
                <div className="flex space-x-2">
                  <EditTicketModal token={token} companies={companies} ticket={ticket} />
                  <DeleteTicketModal token={token} ticket={ticket} />
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  };
  
  
  export default TicketsPage;
  