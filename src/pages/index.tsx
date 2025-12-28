/* eslint-disable jsx-a11y/anchor-is-valid */
import { Badge, Card, Spinner } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import axios from "axios";
import Cookies from "js-cookie";
import { MAINURL } from "../utils/constants";
import Chart from "react-apexcharts";
import {
  BuildingLibraryIcon,
  UsersIcon,
  TicketIcon,
  
  TagIcon,
  RectangleStackIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

interface StudentStats {
  total: number;
  male: number;
  female: number;
  verified: number;
  notVerified: number;
}

interface TicketStats {
  active: number;
  inhand: number;
  used: number;
}

interface ExtraStats {
  universities: number;
  companies: number;
  categories: number;
  banners: number;
  tickets: number;
}

interface EntityCount {
  id: number;
  name: string;
  count: number;
}

interface TicketsByCategory {
  id: number;
  name: string;
  active: number;
  used: number;
}

interface CompanyTicketStats {
  id: number;
  name: string;
  active: number;
  inhand: number;
  used: number;
}

interface TopUsage {
  categories: EntityCount[];
  companies: EntityCount[];
  universities: EntityCount[];
}

const DashboardPage: FC = function () {
  // Temel istatistik durumları
  const [studentStats, setStudentStats] = useState<StudentStats>({
    total: 0,
    male: 0,
    female: 0,
    verified: 0,
    notVerified: 0,
  });
  const [ticketStats, setTicketStats] = useState<TicketStats>({
    active: 0,
    inhand: 0,
    used: 0,
  });
  const [extraStats, setExtraStats] = useState<ExtraStats>({
    universities: 0,
    companies: 0,
    categories: 0,
    banners: 0,
    tickets: 0,
  });

  // Ek veriler
  const [companiesByCategory, setCompaniesByCategory] = useState<EntityCount[]>([]);
  const [ticketsByCategory, setTicketsByCategory] = useState<TicketsByCategory[]>([]);
  const [companiesTicketData, setCompaniesTicketData] = useState<CompanyTicketStats[]>([]);
  const [topUsage, setTopUsage] = useState<TopUsage>({
    categories: [],
    companies: [],
    universities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Token ve header ayarları
  const token = Cookies.get("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const fetchAllStats = async () => {
    try {
      // Temel API istekleri
      const [
        total,
        male,
        female,
        verified,
        notVerified,
        ticketActive,
        ticketInhand,
        ticketUsed,
        universities,
        companies,
        categories,
        banners,
        allTickets,
      ] = await Promise.all([
        axios.get(`${MAINURL}api/v1/stats/students/count`, headers),
        axios.get(`${MAINURL}api/v1/stats/students/male-count`, headers),
        axios.get(`${MAINURL}api/v1/stats/students/female-count`, headers),
        axios.get(`${MAINURL}api/v1/stats/students/verified-count`, headers),
        axios.get(`${MAINURL}api/v1/stats/students/not-verified-count`, headers),
        axios.get(`${MAINURL}api/v1/stats/tickets/count/active`, headers),
        axios.get(`${MAINURL}api/v1/stats/tickets/count/inhand`, headers),
        axios.get(`${MAINURL}api/v1/stats/tickets/count/used`, headers),
        axios.get(`${MAINURL}api/v1/universities/`, headers),
        axios.get(`${MAINURL}api/v1/companies/`, headers),
        axios.get(`${MAINURL}api/v1/categories/`, headers),
        axios.get(`${MAINURL}api/v1/banners/`, headers),
        axios.get(`${MAINURL}api/v1/tickets/`, headers),
      ]);

      setStudentStats({
        total: total.data.count,
        male: male.data.count,
        female: female.data.count,
        verified: verified.data.count,
        notVerified: notVerified.data.count,
      });
      setTicketStats({
        active: ticketActive.data.count,
        inhand: ticketInhand.data.count,
        used: ticketUsed.data.count,
      });
      setExtraStats({
        universities: universities.data.length,
        companies: companies.data.length,
        categories: categories.data.length,
        banners: banners.data.length,
        tickets: allTickets.data.length,
      });

      // Ek API: Kategoriler, Şirketler, Üniversiteler ve Most Used verileri
      const [
        categoriesRes,
        companiesRes,
        universitiesRes,
        mostUsedCategoriesRes,
        mostUsedCompaniesRes,
        mostUsedUniversitiesRes,
      ] = await Promise.all([
        axios.get(`${MAINURL}api/v1/categories/`, headers),
        axios.get(`${MAINURL}api/v1/companies/`, headers),
        axios.get(`${MAINURL}api/v1/universities/`, headers),
        axios.get(`${MAINURL}api/v1/stats/tickets/count/most-used-categories`, headers),
        axios.get(`${MAINURL}api/v1/stats/tickets/count/most-used-companies`, headers),
        axios.get(`${MAINURL}api/v1/stats/tickets/count/most-used-universities`, headers),
      ]);

      // En Çok Kullanılanlar için dönüşüm
      const topCategoriesData: EntityCount[] = mostUsedCategoriesRes.data.map((item: any) => {
        const cat = categoriesRes.data.find((c: any) => c.id === item.category_id);
        return {
          id: item.category_id,
          name: cat ? cat.name : `ID ${item.category_id}`,
          count: item.count,
        };
      });
      const topCompaniesData: EntityCount[] = mostUsedCompaniesRes.data.map((item: any) => {
        const comp = companiesRes.data.find((c: any) => c.id === item.company_id);
        return {
          id: item.company_id,
          name: comp ? comp.name : `ID ${item.company_id}`,
          count: item.count,
        };
      });
      const topUniversitiesData: EntityCount[] = mostUsedUniversitiesRes.data.map((item: any) => {
        const uni = universitiesRes.data.find((u: any) => u.id === item.university_id);
        return {
          id: item.university_id,
          name: uni ? uni.name : `ID ${item.university_id}`,
          count: item.count,
        };
      });
      setTopUsage({
        categories: topCategoriesData,
        companies: topCompaniesData,
        universities: topUniversitiesData,
      });

      // Şirket sayısını kategori bazında çekiyoruz
      const companiesByCategoryPromises = categoriesRes.data.map((cat: any) =>
        axios.get(`${MAINURL}api/v1/stats/companies/count/category/${cat.id}`, headers)
      );
      const companiesByCategoryResponses = await Promise.all(companiesByCategoryPromises);
      const companiesByCategoryData: EntityCount[] = categoriesRes.data.map((cat: any, index: number) => ({
        id: cat.id,
        name: cat.name,
        count: companiesByCategoryResponses[index].data.count,
      }));
      setCompaniesByCategory(companiesByCategoryData);

      // Bilet durumunu kategori bazında çekiyoruz (aktif ve kullanılmış)
      const ticketsByCategoryPromisesActive = categoriesRes.data.map((cat: any) =>
        axios.get(`${MAINURL}api/v1/stats/tickets/count/active/category/${cat.id}`, headers)
      );
      const ticketsByCategoryPromisesUsed = categoriesRes.data.map((cat: any) =>
        axios.get(`${MAINURL}api/v1/stats/tickets/count/used/category/${cat.id}`, headers)
      );
      const activeCounts = await Promise.all(ticketsByCategoryPromisesActive);
      const usedCounts = await Promise.all(ticketsByCategoryPromisesUsed);
      const ticketsByCategoryData: TicketsByCategory[] = categoriesRes.data.map((cat: any, index: number) => ({
        id: cat.id,
        name: cat.name,
        active: activeCounts[index].data.count,
        used: usedCounts[index].data.count,
      }));
      setTicketsByCategory(ticketsByCategoryData);

      // Şirketlerin bilet durumları (aktif, inhand, kullanılmış)
      const companiesTicketPromises = companiesRes.data.map((comp: any) =>
        Promise.all([
          axios.get(`${MAINURL}api/v1/stats/companies/count/active-tickets/${comp.id}`, headers),
          axios.get(`${MAINURL}api/v1/stats/companies/count/inhand-tickets/${comp.id}`, headers),
          axios.get(`${MAINURL}api/v1/stats/companies/count/used-tickets/${comp.id}`, headers),
        ]).then(([activeRes, inhandRes, usedRes]) => ({
          id: comp.id,
          name: comp.name,
          active: activeRes.data.count,
          inhand: inhandRes.data.count,
          used: usedRes.data.count,
        }))
      );
      const companiesTicketData = await Promise.all(companiesTicketPromises);
      setCompaniesTicketData(companiesTicketData);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching stats.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NavbarSidebarLayout>
      <div className="p-4 space-y-6 dark:text-white">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner size="xl" color="info" />
          </div>
        ) : error ? (
          <p className="text-red-500 font-semibold">{error}</p>
        ) : (
          <>
            {/* --- Temel İstatistik Kartları --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {/* Öğrenci İstatistikleri */}
              <Card>
                <div className="flex items-center justify-between">
                  <h5 className="text-lg font-bold">Students</h5>
                  <UsersIcon className="h-6 w-6 text-blue-500" />
                </div>
                <ul className="mt-2 space-y-1">
                  <li>
                    Total: <Badge color="info">{studentStats.total}</Badge>
                  </li>
                  <li>
                    Male: <Badge color="purple">{studentStats.male}</Badge>
                  </li>
                  <li>
                    Female: <Badge color="pink">{studentStats.female}</Badge>
                  </li>
                  <li>
                    Verified: <Badge color="success">{studentStats.verified}</Badge>
                  </li>
                  <li>
                    Not Verified: <Badge color="failure">{studentStats.notVerified}</Badge>
                  </li>
                </ul>
              </Card>

              {/* Bilet İstatistikleri */}
              <Card>
                <div className="flex items-center justify-between">
                  <h5 className="text-lg font-bold">Tickets</h5>
                  <TicketIcon className="h-6 w-6 text-green-500" />
                </div>
                <ul className="mt-2 space-y-1">
                  <li>
                    Active: <Badge color="info">{ticketStats.active}</Badge>
                  </li>
                  <li>
                    Inhand: <Badge color="warning">{ticketStats.inhand}</Badge>
                  </li>
                  <li>
                    Used: <Badge color="success">{ticketStats.used}</Badge>
                  </li>
                </ul>
              </Card>

              {/* Ekstra İstatistikler */}
              <Card>
                <div className="flex items-center justify-between">
                  <h5 className="text-lg font-bold">Extra Stats</h5>
                  <Squares2X2Icon className="h-6 w-6 text-indigo-500" />
                </div>
                <ul className="mt-2 space-y-1">
                  <li>
                    Universities: <Badge color="cyan">{extraStats.universities}</Badge>
                  </li>
                  <li>
                    Companies: <Badge color="emerald">{extraStats.companies}</Badge>
                  </li>
                  <li>
                    Categories: <Badge color="pink">{extraStats.categories}</Badge>
                  </li>
                  <li>
                    Banners: <Badge color="warning">{extraStats.banners}</Badge>
                  </li>
                  <li>
                    Tickets: <Badge color="purple">{extraStats.tickets}</Badge>
                  </li>
                </ul>
              </Card>

              {/* Bilet Durumları Pie Chart */}
              <Card>
                <h5 className="text-lg font-bold">Ticket Status (Pie)</h5>
                <Chart
                  type="donut"
                  height={250}
                  series={[ticketStats.active, ticketStats.inhand, ticketStats.used]}
                  options={{
                    labels: ["Active", "Inhand", "Used"],
                    colors: ["#3B82F6", "#F59E0B", "#10B981"],
                    legend: { position: "bottom" },
                  }}
                />
              </Card>
            </div>

            {/* --- Şirketlerin Kategori Bazında Dağılımı --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <h5 className="text-lg font-bold mb-4">Companies by Category</h5>
                <Chart
                  type="bar"
                  height={300}
                  series={[
                    {
                      name: "Companies",
                      data: companiesByCategory.map((cat) => cat.count),
                    },
                  ]}
                  options={{
                    chart: { toolbar: { show: false } },
                    xaxis: {
                      categories: companiesByCategory.map((cat) => cat.name),
                      labels: { rotate: -45 },
                    },
                    colors: ["#34D399"],
                    legend: { show: false },
                  }}
                />
              </Card>

              {/* Kategori Bazında Bilet Dağılımı (Aktif/Kullanılmış) */}
              <Card>
                <h5 className="text-lg font-bold mb-4">Tickets by Category</h5>
                <Chart
                  type="bar"
                  height={300}
                  series={[
                    {
                      name: "Active",
                      data: ticketsByCategory.map((cat) => cat.active),
                    },
                    {
                      name: "Used",
                      data: ticketsByCategory.map((cat) => cat.used),
                    },
                  ]}
                  options={{
                    chart: { stacked: true, toolbar: { show: false } },
                    xaxis: {
                      categories: ticketsByCategory.map((cat) => cat.name),
                      labels: { rotate: -45 },
                    },
                    colors: ["#60A5FA", "#F87171"],
                    legend: { position: "bottom" },
                  }}
                />
              </Card>
            </div>

            {/* --- Şirketlerin Bilet Durumlarına Göre Listesi --- */}
            <Card>
              <h5 className="text-lg font-bold mb-4">Companies Ticket Details</h5>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Company</th>
                      <th className="px-4 py-2">Active</th>
                      <th className="px-4 py-2">Inhand</th>
                      <th className="px-4 py-2">Used</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {companiesTicketData.map((comp) => (
                      <tr key={comp.id}>
                        <td className="px-4 py-2">{comp.name}</td>
                        <td className="px-4 py-2 text-center">{comp.active}</td>
                        <td className="px-4 py-2 text-center">{comp.inhand}</td>
                        <td className="px-4 py-2 text-center">{comp.used}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* --- En Çok Kullanılanlar (Top 5) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <h5 className="text-lg font-bold mb-2">Top 5 Categories</h5>
                <ul className="space-y-1">
                  {topUsage.categories.map((item) => (
                    <li key={item.id}>
                      {item.name}: <Badge color="info">{item.count}</Badge>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card>
                <h5 className="text-lg font-bold mb-2">Top 5 Companies</h5>
                <ul className="space-y-1">
                  {topUsage.companies.map((item) => (
                    <li key={item.id}>
                      {item.name}: <Badge color="info">{item.count}</Badge>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card>
                <h5 className="text-lg font-bold mb-2">Top 5 Universities</h5>
                <ul className="space-y-1">
                  {topUsage.universities.map((item) => (
                    <li key={item.id}>
                      {item.name}: <Badge color="info">{item.count}</Badge>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </>
        )}
      </div>
    </NavbarSidebarLayout>
  );
};

export default DashboardPage;
