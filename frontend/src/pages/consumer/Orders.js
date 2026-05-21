import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import TableComponent from "../../components/TableComponent";
import StatusBadge from "../../components/StatusBadge";
import OrderDetailModal from "../../components/OrderDetailModal";
import { getMyOrders } from "../../api/orderRead";

function formatCurrency(value) {
  const num = Number(value || 0);
  return `${num.toLocaleString()}원`;
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function formatDateTime(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

function normalizeOrders(orderData) {
  if (!orderData) return [];

  const items = Array.isArray(orderData)
    ? orderData
    : orderData.items || orderData.orders || [];

  return items.map((item, index) => ({
    id: item.id || index,
    orderNumber: item.order_number || item.orderNo || item.order_no || "-",
    status: item.status || item.order_status || item.payment_status || "-",
    totalProductAmount:
      item.total_product_amount ?? item.totalProductAmount ?? 0,
    shippingFee: item.total_shipping_fee ?? item.shippingFee ?? 3000,
    totalAmount:
      item.total_payment_amount ??
      item.total_amount ??
      item.totalAmount ??
      item.amount ??
      0,
    createdAt: item.ordered_at || item.created_at || item.createdAt || null,
  }));
}

function getStatusLabel(status) {
  const key = String(status || "").toUpperCase();

  switch (key) {
    case "PAID":
      return "결제완료";
    case "PENDING":
      return "결제대기";
    case "READY":
      return "배송준비";
    case "SHIPPING":
      return "배송중";
    case "DELIVERED":
      return "배송완료";
    case "CANCELLED":
      return "취소됨";
    case "FAILED":
      return "실패";
    default:
      return status || "-";
  }
}

function getStatusVariant(status) {
  const key = String(status || "").toUpperCase();

  if (["PAID", "DELIVERED"].includes(key)) return "success";
  if (["PENDING", "READY", "SHIPPING"].includes(key)) return "warning";
  if (["CANCELLED", "FAILED"].includes(key)) return "danger";
  return "info";
}

function toDateText(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const statusOptions = [
  { label: "결제완료", value: "PAID" },
  { label: "결제대기", value: "PENDING" },
  { label: "배송준비", value: "READY" },
  { label: "배송중", value: "SHIPPING" },
  { label: "배송완료", value: "DELIVERED" },
  { label: "취소됨", value: "CANCELLED" },
  { label: "실패", value: "FAILED" },
];

export default function Orders() {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [orders, setOrders] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await getMyOrders();
        setOrders(normalizeOrders(response));
      } catch (error) {
        console.error(error);
        setOrders([]);
        setErrorMessage(
          error?.response?.data?.detail || "주문 내역을 불러오지 못했습니다.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    return orders.filter((order) => {
      const matchKeyword =
        !keyword || String(order.orderNumber).toLowerCase().includes(keyword);

      const matchStatus = statusValue
        ? String(order.status).toUpperCase() === statusValue
        : true;

      const orderDate = toDateText(order.createdAt);
      const matchStartDate = startDate ? orderDate >= startDate : true;
      const matchEndDate = endDate ? orderDate <= endDate : true;

      return matchKeyword && matchStatus && matchStartDate && matchEndDate;
    });
  }, [orders, searchValue, statusValue, startDate, endDate]);

  const summary = useMemo(() => {
    const totalCount = orders.length;
    const totalAmount = orders.reduce(
      (sum, item) => sum + Number(item.totalAmount || 0),
      0,
    );
    const paidCount = orders.filter(
      (item) => String(item.status || "").toUpperCase() === "PAID",
    ).length;

    return {
      totalCount,
      totalAmount,
      paidCount,
    };
  }, [orders]);

  const columns = [
    {
      key: "orderNumber",
      title: "주문번호",
      width: "140px",
      headerAlign: "center",
      align: "center",
      render: (value) => <OrderNoText>{value}</OrderNoText>,
    },
    {
      key: "createdAt",
      title: "주문일시",
      width: "140px",
      headerAlign: "center",
      align: "center",
      sortType: "date",
      render: (value) => formatDateTime(value),
    },
    {
      key: "status",
      title: "주문상태",
      width: "40px",
      headerAlign: "center",
      align: "center",
      sortable: false,
      render: (value) => (
        <StatusBadge
          value={getStatusLabel(value)}
          variant={getStatusVariant(value)}
          width="88px"
        />
      ),
    },
    {
      key: "totalAmount",
      title: "결제금액",
      width: "140px",
      headerAlign: "center",
      align: "center",
      sortType: "number",
      render: (value) => formatCurrency(value),
    },
    {
      key: "detail",
      title: "상세",
      width: "100px",
      headerAlign: "center",
      align: "center",
      sortable: false,
      render: (_, row) => (
        <DetailButton
          type="button"
          onClick={() => {
            setSelectedOrder(row);
            setIsModalOpen(true);
          }}
        >
          보기
        </DetailButton>
      ),
    },
  ];

  if (loading) {
    return <PageState>주문 내역을 불러오는 중입니다.</PageState>;
  }

  if (errorMessage) {
    return <PageState>{errorMessage}</PageState>;
  }

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle>주문 내역</PageTitle>
        <PageSubText>
          날짜, 상태, 주문번호로 주문 내역을 확인하세요.
        </PageSubText>
      </PageHeader>

      <SummaryGrid>
        <SummaryCard>
          <SummaryLabel>전체 주문 건수</SummaryLabel>
          <SummaryValue>{summary.totalCount}건</SummaryValue>
        </SummaryCard>

        <SummaryCard>
          <SummaryLabel>결제완료 주문</SummaryLabel>
          <SummaryValue>{summary.paidCount}건</SummaryValue>
        </SummaryCard>

        <SummaryCard>
          <SummaryLabel>누적 주문금액</SummaryLabel>
          <SummaryValue>{formatCurrency(summary.totalAmount)}</SummaryValue>
        </SummaryCard>
      </SummaryGrid>

      <TableComponent
        variant="default"
        columns={columns}
        data={filteredOrders}
        rowKey="id"
        headerAlign="center"
        cellAlign="center"
        searchValue={searchValue}
        onSearchChange={(value) => {
          setSearchValue(value);
          setPage(1);
        }}
        searchPlaceholder="주문번호로 검색"
        filterValue={statusValue}
        onFilterChange={(value) => {
          setStatusValue(value);
          setPage(1);
        }}
        filterOptions={statusOptions}
        filterPlaceholder="주문상태"
        startDate={startDate}
        onStartDateChange={(value) => {
          setStartDate(value);
          setPage(1);
        }}
        endDate={endDate}
        onEndDateChange={(value) => {
          setEndDate(value);
          setPage(1);
        }}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      <OrderDetailModal
        open={isModalOpen}
        order={selectedOrder}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </PageWrap>
  );
}

const PageState = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  font-size: 15px;
  font-weight: 600;
`;

const PageWrap = styled.div`
  min-height: 100vh;
  padding: 32px 24px 48px;
  background: #f8fafc;
`;

const PageHeader = styled.div`
  margin-bottom: 18px;
`;

const PageTitle = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 28px;
  font-weight: 800;
`;

const PageSubText = styled.div`
  margin-top: 6px;
  color: #6b7280;
  font-size: 14px;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  background: #ffffff;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
`;

const SummaryLabel = styled.div`
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
`;

const SummaryValue = styled.div`
  margin-top: 8px;
  color: #111827;
  font-size: 20px;
  font-weight: 800;
`;

const OrderNoText = styled.span`
  color: #111827;
  font-weight: 700;
`;

const DetailButton = styled.button`
  height: 32px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;
