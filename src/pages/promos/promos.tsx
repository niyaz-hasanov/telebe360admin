import {
  Breadcrumb,
  Button,
  Label,
  Modal,
  Table,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  HiCog,
  HiDotsVertical,
  HiExclamationCircle,
  HiHome,
  HiPencilAlt,
  HiTrash,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { Pagination } from "../users/list";
import { APIURL } from "../../utils/constants";

type Promo = {
  id: string;
  code: string;
  count: number;
  bonus_coins: number;
  description: string;
  is_active: boolean;
  expires_at: string; // ISO
  created_at: string; // ISO
  updated_at: string; // ISO
};

const PromocodesPage: FC = function () {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenFromCookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    setToken(tokenFromCookies || "");

    fetch(`${APIURL}promos/`, {
      headers: { Authorization: `Bearer ${tokenFromCookies}` },
    })
      .then((r) => r.json())
      .then((data) => setPromos(data))
      .catch((e) => console.error("Error fetching promos:", e));
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
              <Breadcrumb.Item>Promocodes</Breadcrumb.Item>
            </Breadcrumb>

            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All Promocodes
            </h1>
          </div>

          <div className="block items-center sm:flex">
            <SearchForPromos />

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
              <AddPromoModal token={token} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <PromosTable promos={promos} token={token} />
            </div>
          </div>
        </div>
      </div>

      <Pagination />
    </NavbarSidebarLayout>
  );
};

const SearchForPromos: FC = function () {
  return (
    <form className="mb-4 sm:mb-0 sm:pr-3" action="#" method="GET">
      <Label htmlFor="promos-search" className="sr-only">
        Search
      </Label>
      <div className="relative mt-1 lg:w-64 xl:w-96">
        <TextInput id="promos-search" name="promos-search" placeholder="Search for promocodes" />
      </div>
    </form>
  );
};

const toISOorEmpty = (dtLocal: string) => {
  if (!dtLocal) return "";
  const d = new Date(dtLocal);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
};

const isoToDatetimeLocal = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const AddPromoModal: FC<{ token: string }> = function ({ token }) {
  const [isOpen, setOpen] = useState(false);

  const [code, setCode] = useState("");
  const [count, setCount] = useState<string>("0");
  const [bonusCoins, setBonusCoins] = useState<string>("1");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState<string>(""); // datetime-local

  const handleAddPromo = () => {
    const payload: any = {
      code: code.trim(),
      count: parseInt(count, 10) || 0,
      bonus_coins: parseInt(bonusCoins, 10) || 0,
      description,
      is_active: isActive,
      expires_at: toISOorEmpty(expiresAt),
    };

    // expires_at boşsa API kabul etmiyorsa:
    // if (!payload.expires_at) delete payload.expires_at;

    fetch(`${APIURL}promos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then(() => {
        window.location.reload();
        setOpen(false);
      })
      .catch((e) => console.error("Error adding promo:", e));
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Add Promo
      </Button>

      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add Promocode</strong>
        </Modal.Header>

        <Modal.Body>
          <form>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="promoCode">Code</Label>
                <TextInput
                  id="promoCode"
                  name="promoCode"
                  placeholder="PROMO2025"
                  className="mt-1"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="promoCount">Count</Label>
                <TextInput
                  id="promoCount"
                  name="promoCount"
                  placeholder="0"
                  className="mt-1"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="promoBonus">Bonus Coins</Label>
                <TextInput
                  id="promoBonus"
                  name="promoBonus"
                  placeholder="1"
                  className="mt-1"
                  value={bonusCoins}
                  onChange={(e) => setBonusCoins(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="promoExpiresAt">Expires At</Label>
                <TextInput
                  id="promoExpiresAt"
                  name="promoExpiresAt"
                  type="datetime-local"
                  className="mt-1"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>

              <div className="lg:col-span-2">
                <Label htmlFor="promoDescription">Description</Label>
                <TextInput
                  id="promoDescription"
                  name="promoDescription"
                  placeholder="Description"
                  className="mt-1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="lg:col-span-2">
                <ToggleSwitch checked={isActive} label="Is Active" onChange={setIsActive} />
              </div>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex justify-end space-x-2">
            <Button color="gray" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleAddPromo}>
              Add Promo
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const EditPromoModal: FC<{ token: string; promo: Promo }> = function ({ token, promo }) {
  const [isOpen, setOpen] = useState(false);

  const [code, setCode] = useState(promo.code);
  const [count, setCount] = useState<string>(String(promo.count ?? 0));
  const [bonusCoins, setBonusCoins] = useState<string>(String(promo.bonus_coins ?? 0));
  const [description, setDescription] = useState(promo.description ?? "");
  const [isActive, setIsActive] = useState(!!promo.is_active);
  const [expiresAt, setExpiresAt] = useState<string>(isoToDatetimeLocal(promo.expires_at));

  useEffect(() => {
    if (!isOpen) return;
    setCode(promo.code);
    setCount(String(promo.count ?? 0));
    setBonusCoins(String(promo.bonus_coins ?? 0));
    setDescription(promo.description ?? "");
    setIsActive(!!promo.is_active);
    setExpiresAt(isoToDatetimeLocal(promo.expires_at));
  }, [isOpen, promo]);

  const handleEditPromo = () => {
    const payload: any = {
      code: code.trim(),
      count: parseInt(count, 10) || 0,
      bonus_coins: parseInt(bonusCoins, 10) || 0,
      description,
      is_active: isActive,
      expires_at: toISOorEmpty(expiresAt),
    };

    // expires_at boşsa API kabul etmiyorsa:
    // if (!payload.expires_at) delete payload.expires_at;

    fetch(`${APIURL}promos/${promo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then(() => {
        setOpen(false);
        window.location.reload();
      })
      .catch((e) => console.error("Error editing promo:", e));
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <HiPencilAlt className="text-sm" />
      </Button>

      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edit Promocode</strong>
        </Modal.Header>

        <Modal.Body>
          <form>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="editPromoCode">Code</Label>
                <TextInput
                  id="editPromoCode"
                  name="editPromoCode"
                  className="mt-1"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="editPromoCount">Count</Label>
                <TextInput
                  id="editPromoCount"
                  name="editPromoCount"
                  className="mt-1"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="editPromoBonus">Bonus Coins</Label>
                <TextInput
                  id="editPromoBonus"
                  name="editPromoBonus"
                  className="mt-1"
                  value={bonusCoins}
                  onChange={(e) => setBonusCoins(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="editPromoExpiresAt">Expires At</Label>
                <TextInput
                  id="editPromoExpiresAt"
                  name="editPromoExpiresAt"
                  type="datetime-local"
                  className="mt-1"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>

              <div className="lg:col-span-2">
                <Label htmlFor="editPromoDescription">Description</Label>
                <TextInput
                  id="editPromoDescription"
                  name="editPromoDescription"
                  className="mt-1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="lg:col-span-2">
                <ToggleSwitch checked={isActive} label="Is Active" onChange={setIsActive} />
              </div>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex justify-end space-x-2">
            <Button color="gray" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleEditPromo}>
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const DeletePromoModal: FC<{ token: string; promo: Promo }> = function ({ token, promo }) {
  const [isOpen, setOpen] = useState(false);

  const handleDeletePromo = () => {
    fetch(`${APIURL}promos/${promo.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then(() => {
        window.location.reload();
        setOpen(false);
      })
      .catch((e) => console.error("Error deleting promo:", e));
  };

  return (
    <>
      <Button color="failure" onClick={() => setOpen(!isOpen)}>
        <HiTrash className="text-sm" />
      </Button>

      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Delete Promocode</strong>
        </Modal.Header>
        <Modal.Body>
          <p className="dark:text-white">Are you sure you want to delete this promocode?</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
            <b>{promo.code}</b> — {promo.id}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end space-x-2">
            <Button color="gray" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button color="failure" onClick={handleDeletePromo}>
              Delete
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const PromosTable: FC<{ promos: Promo[]; token: string }> = function ({ promos, token }) {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Code</Table.HeadCell>
        <Table.HeadCell>Count</Table.HeadCell>
        <Table.HeadCell>Bonus Coins</Table.HeadCell>
        <Table.HeadCell>Description</Table.HeadCell>
        <Table.HeadCell>Active</Table.HeadCell>
        <Table.HeadCell>Expires At</Table.HeadCell>
        <Table.HeadCell>Created At</Table.HeadCell>
        <Table.HeadCell>Updated At</Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
      </Table.Head>

      <Table.Body className="bg-white dark:bg-gray-800 dark:text-white">
        {promos.map((promo) => (
          <Table.Row key={promo.id}>
            <Table.Cell className="whitespace-wrap">{promo.id}</Table.Cell>
            <Table.Cell>{promo.code}</Table.Cell>
            <Table.Cell>{promo.count}</Table.Cell>
            <Table.Cell>{promo.bonus_coins}</Table.Cell>
            <Table.Cell className="max-w-[360px] truncate">{promo.description}</Table.Cell>
            <Table.Cell>{promo.is_active ? "Yes" : "No"}</Table.Cell>
            <Table.Cell>{promo.expires_at}</Table.Cell>
            <Table.Cell >{promo.created_at}</Table.Cell>
            <Table.Cell>{promo.updated_at}</Table.Cell>
            <Table.Cell>
              <div className="flex space-x-2">
                <EditPromoModal token={token} promo={promo} />
                <DeletePromoModal token={token} promo={promo} />
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default PromocodesPage;
