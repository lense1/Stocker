import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Plus } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill";
import BlotFormatter from "quill-blot-formatter";
import SearchBar from "../../../components/SearchBar";
import SearchDate from "../../../components/SearchDate";
import SelectBar from "../../../components/SelectBar";
import "react-datepicker/dist/react-datepicker.css";
import "react-quill/dist/quill.snow.css";

import { getCategories } from "../../../api/category";
import {
  getAdminProductDetail,
  resolveCatalogName,
  updateAdminProduct,
  uploadAdminDetailImage,
  uploadAdminThumbnailImage,
} from "../../../api/adminProduct";
import ToggleSwitch from "../../../components/ToggleSwitch";

const DatePickerStyle = createGlobalStyle`
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker {
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  }
  .react-datepicker__header {
    background-color: #ffffff;
    border-bottom: 1px solid var(--border);
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  .react-datepicker__day--selected {
    background-color: var(--blue) !important;
    border-radius: 8px;
  }
`;

Quill.register("modules/blotFormatter", BlotFormatter);

const saleStatusOptions = [
  { value: "ON_SALE", label: "판매중" },
  { value: "READY", label: "판매예정" },
  { value: "STOPPED", label: "판매중지" },
  { value: "SOLD_OUT", label: "품절" },
  { value: "ENDED", label: "판매종료" },
];

const FIXED_SHIPPING_FROM =
  "충청남도 천안시 동남구 대흥로 215 7층 (우 : 31144)";
const FIXED_RETURN_ADDRESS =
  "충청남도 천안시 동남구 대흥로 215 7층 (우 : 31144)";

function insertImageWithLineBreak(editor, imageUrl) {
  if (!editor) return;

  const range = editor.getSelection(true);
  const insertIndex = range ? range.index : editor.getLength();

  editor.insertText(insertIndex, "\n", "user");
  editor.insertEmbed(insertIndex + 1, "image", imageUrl, "user");
  editor.insertText(insertIndex + 2, "\n", "user");
  editor.setSelection(insertIndex + 3, 0, "user");
}

export default function ProductUpdate() {
  const nav = useNavigate();
  const { productCode } = useParams();
  const location = useLocation();
  const aiPricingSectionRef = useRef(null);

  const thumbnailInputRef = useRef(null);
  const quillRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [categoryTab, setCategoryTab] = useState("select");
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [categoryKeyword, setCategoryKeyword] = useState("");

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [detailImageUrls, setDetailImageUrls] = useState([]);

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [isDetailImageUploading, setIsDetailImageUploading] = useState(false);

  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    productCode: "",
    productName: "",
    saleStatus: "ON_SALE",

    catalogExternalId: "",
    catalogName: "",
    currentLowestPrice: "",

    salePrice: "",
    costPrice: "",

    useAiPrice: false,
    minPrice: "",
    maxPrice: "",
    pricePerTime: "",

    stockQty: "",
    safetyStock: "",
    expiryDate: "",

    description: "",

    brandName: "",
    origin: "",

    shippingFrom: FIXED_SHIPPING_FROM,
    shippingFee: "",

    returnAddress: FIXED_RETURN_ADDRESS,
    returnFee: "",
    exchangeFee: "",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsPageLoading(true);

        const [categoryData, detail] = await Promise.all([
          getCategories(),
          getAdminProductDetail(productCode),
        ]);

        setCategories(categoryData);

        const targetMain = categoryData.find((mainCategory) =>
          mainCategory.subCategories?.some(
            (subCategory) => subCategory.id === detail.category_id,
          ),
        );

        const targetSub = targetMain?.subCategories?.find(
          (subCategory) => subCategory.id === detail.category_id,
        );

        setSelectedMainCategoryId(targetMain?.id ?? null);
        setSelectedSubCategoryId(targetSub?.id ?? null);

        setForm({
          productCode: detail.product_code,
          productName: detail.product_name ?? "",
          saleStatus: detail.sale_status ?? "ON_SALE",

          catalogExternalId: detail.catalog_external_id ?? "",
          catalogName: detail.catalog_name ?? "",
          currentLowestPrice:
            detail.current_lowest_price != null
              ? String(detail.current_lowest_price)
              : "",

          salePrice: detail.sale_price != null ? String(detail.sale_price) : "",
          costPrice: detail.cost_price != null ? String(detail.cost_price) : "",

          useAiPrice: Boolean(detail.ai_pricing_enabled),
          minPrice:
            detail.min_price_limit != null
              ? String(detail.min_price_limit)
              : "",
          maxPrice:
            detail.max_price_limit != null
              ? String(detail.max_price_limit)
              : "",
          pricePerTime:
            detail.price_per_time != null ? String(detail.price_per_time) : "",

          stockQty: detail.stock_qty != null ? String(detail.stock_qty) : "",
          safetyStock:
            detail.safety_stock_qty != null
              ? String(detail.safety_stock_qty)
              : "",
          expiryDate: detail.expiration_date ?? "",

          description: detail.description_html ?? "",

          brandName: detail.brand_name ?? "",
          origin: detail.origin_country ?? "",

          shippingFrom: FIXED_SHIPPING_FROM,
          shippingFee:
            detail.shipping_fee != null ? String(detail.shipping_fee) : "",

          returnAddress: FIXED_RETURN_ADDRESS,
          returnFee: "",
          exchangeFee: "",
        });

        setThumbnailPreview(detail.thumbnail_image_url ?? null);
        setThumbnailUrl(detail.thumbnail_image_url ?? "");
        setDetailImageUrls(detail.detail_image_urls ?? []);
      } catch (error) {
        console.error(error);
        alert(
          error?.response?.data?.detail || "상품 정보를 불러오지 못했습니다.",
        );
        nav("/admin/product-list", { replace: true });
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchInitialData();
  }, [nav, productCode]);

  useEffect(() => {
    if (!isPageLoading && location.state?.focusSection === "ai-pricing") {
      setTimeout(() => {
        aiPricingSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 120);
    }
  }, [isPageLoading, location.state]);

  const activeMainCategory = useMemo(() => {
    return categories.find(
      (category) => category.id === selectedMainCategoryId,
    );
  }, [categories, selectedMainCategoryId]);

  const activeSubCategory = useMemo(() => {
    if (!activeMainCategory) return null;
    return activeMainCategory.subCategories?.find(
      (subCategory) => subCategory.id === selectedSubCategoryId,
    );
  }, [activeMainCategory, selectedSubCategoryId]);

  const selectedCategoryLabel =
    activeMainCategory && activeSubCategory
      ? `${activeMainCategory.name} > ${activeSubCategory.name}`
      : "";

  const filteredCategories = useMemo(() => {
    const keyword = categoryKeyword.trim().toLowerCase();

    if (!keyword) return categories;

    return categories
      .map((category) => {
        const mainMatched = category.name.toLowerCase().includes(keyword);

        const matchedSubCategories =
          category.subCategories?.filter((subCategory) =>
            `${category.name} ${subCategory.name}`
              .toLowerCase()
              .includes(keyword),
          ) || [];

        if (mainMatched) return category;
        if (matchedSubCategories.length > 0) {
          return {
            ...category,
            subCategories: matchedSubCategories,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [categories, categoryKeyword]);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const sanitizeIntegerInput = (value) => {
    const raw = String(value ?? "");
    const cleaned = raw.replace(/[^\d-]/g, "");

    if (cleaned.startsWith("-")) {
      return `-${cleaned.slice(1).replace(/-/g, "")}`;
    }

    return cleaned.replace(/-/g, "");
  };

  const validatePositiveNumber = (label, value, { required = false } = {}) => {
    const raw = String(value ?? "").trim();

    if (!raw) {
      return required ? `${label}를 입력해주세요.` : "";
    }

    if (!/^-?\d+$/.test(raw)) {
      return `${label}는 숫자만 입력할 수 있습니다.`;
    }

    if (Number(raw) <= 0) {
      return `${label}는 0보다 큰 값만 입력할 수 있습니다.`;
    }

    return "";
  };

  const validateExpiryDate = (value) => {
    if (!value) return "";

    const expiry = new Date(value);
    if (Number.isNaN(expiry.getTime())) {
      return "유통기한이 올바르지 않습니다.";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    if (expiry <= today) {
      return "유통기한은 오늘 이후 날짜만 선택할 수 있습니다.";
    }

    return "";
  };

  const handlePositiveNumberChange = (key, label) => (e) => {
    const nextValue = sanitizeIntegerInput(e.target.value);

    handleChange(key, nextValue);
    setFieldErrors((prev) => ({
      ...prev,
      [key]: validatePositiveNumber(label, nextValue),
    }));
  };

  const handleExpiryDateChange = (date) => {
    handleChange("expiryDate", date);
    setFieldErrors((prev) => ({
      ...prev,
      expiryDate: validateExpiryDate(date),
    }));
  };

  const validateUpdateForm = () => {
    const nextErrors = {
      salePrice: validatePositiveNumber("판매가", form.salePrice, {
        required: true,
      }),
      costPrice: validatePositiveNumber("원가", form.costPrice),
      minPrice: form.useAiPrice
        ? validatePositiveNumber("최저가 제한", form.minPrice)
        : "",
      maxPrice: form.useAiPrice
        ? validatePositiveNumber("최고가 제한", form.maxPrice)
        : "",
      pricePerTime: form.useAiPrice
        ? validatePositiveNumber("회당 조정가", form.pricePerTime)
        : "",
      safetyStock: validatePositiveNumber("안전재고", form.safetyStock),
      expiryDate: validateExpiryDate(form.expiryDate),
    };

    if (
      form.useAiPrice &&
      form.minPrice &&
      form.maxPrice &&
      !nextErrors.minPrice &&
      !nextErrors.maxPrice &&
      Number(form.minPrice) > Number(form.maxPrice)
    ) {
      nextErrors.maxPrice =
        "최고가 제한은 최저가 제한보다 크거나 같아야 합니다.";
    }

    setFieldErrors(nextErrors);

    return Object.values(nextErrors).find(Boolean) || "";
  };

  const handleResolveCatalogName = async () => {
    const catalogId = form.catalogExternalId.trim();

    if (!catalogId) {
      setCatalogError("");
      setForm((prev) => ({
        ...prev,
        catalogName: "",
        currentLowestPrice: "",
      }));
      return;
    }

    try {
      setIsCatalogLoading(true);
      setCatalogError("");

      const data = await resolveCatalogName(catalogId);

      const nextLowestPrice =
        data?.current_lowest_price != null
          ? String(data.current_lowest_price)
          : "";

      setForm((prev) => ({
        ...prev,
        catalogName: data?.catalog_name ?? "",
        currentLowestPrice: nextLowestPrice,
        salePrice:
          !String(prev.salePrice ?? "").trim() && nextLowestPrice
            ? nextLowestPrice
            : prev.salePrice,
      }));

      if (!String(form.salePrice ?? "").trim() && nextLowestPrice) {
        setFieldErrors((prev) => ({
          ...prev,
          salePrice: "",
        }));
      }
    } catch (error) {
      console.error(error);

      if (error.code === "ECONNABORTED") {
        setCatalogError(
          "카탈로그 조회 시간이 초과되었습니다. 다시 시도해주세요.",
        );
      } else {
        setCatalogError(
          error?.response?.data?.detail || "카탈로그 이름 조회에 실패했습니다.",
        );
      }

      setForm((prev) => ({
        ...prev,
        catalogName: "",
        currentLowestPrice: "",
      }));
    } finally {
      setIsCatalogLoading(false);
    }
  };

  const handleThumbnailUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsThumbnailUploading(true);

      const localPreview = URL.createObjectURL(file);
      setThumbnailPreview(localPreview);

      const result = await uploadAdminThumbnailImage(file);
      setThumbnailUrl(result.image_url);
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.detail || "대표이미지 업로드에 실패했습니다.",
      );
    } finally {
      setIsThumbnailUploading(false);
    }
  };

  const handleEditorImageUpload = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        setIsDetailImageUploading(true);

        const result = await uploadAdminDetailImage(file);
        const editor = quillRef.current?.getEditor();
        insertImageWithLineBreak(editor, result.image_url);

        setDetailImageUrls((prev) => {
          if (prev.includes(result.image_url)) return prev;
          return [...prev, result.image_url];
        });
      } catch (error) {
        console.error(error);
        alert(
          error?.response?.data?.detail || "상세 이미지 업로드에 실패했습니다.",
        );
      } finally {
        setIsDetailImageUploading(false);
      }
    };
  };

  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: handleEditorImageUpload,
        },
      },
      blotFormatter: {},
      clipboard: {
        matchVisual: false,
      },
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
    }),
    [],
  );

  const quillFormats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedSubCategoryId) {
      alert("소분류 카테고리를 선택해주세요.");
      return;
    }

    if (!form.productName.trim()) {
      alert("상품명을 입력해주세요.");
      return;
    }

    if (!thumbnailUrl) {
      alert("대표이미지를 업로드해주세요.");
      return;
    }

    const validationMessage = validateUpdateForm();
    if (validationMessage) {
      alert(validationMessage);
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        category_id: selectedSubCategoryId,
        product_name: form.productName.trim(),
        sale_status: form.saleStatus,

        catalog_external_id: form.catalogExternalId.trim() || null,
        catalog_name: form.catalogName.trim() || null,
        current_lowest_price: form.currentLowestPrice
          ? Number(form.currentLowestPrice)
          : null,

        sale_price: Number(form.salePrice || 0),
        cost_price: Number(form.costPrice || 0),

        ai_pricing_enabled: form.useAiPrice,
        min_price_limit:
          form.useAiPrice && form.minPrice ? Number(form.minPrice) : null,
        max_price_limit:
          form.useAiPrice && form.maxPrice ? Number(form.maxPrice) : null,
        price_per_time:
          form.useAiPrice && form.pricePerTime
            ? Number(form.pricePerTime)
            : null,

        stock_qty: Number(form.stockQty || 0),
        safety_stock_qty: Number(form.safetyStock || 0),
        expiration_date: form.expiryDate || null,

        description_html: form.description || "",

        brand_name: form.brandName.trim() || null,
        origin_country: form.origin.trim() || null,

        shipping_fee: Number(form.shippingFee || 0),

        thumbnail_image_url: thumbnailUrl,
        detail_image_urls: detailImageUrls,
      };

      await updateAdminProduct(productCode, payload);

      alert("상품이 수정되었습니다.");
      nav("/admin/product-list", { replace: true });
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "상품 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) {
    return (
      <PageWrap>
        <DatePickerStyle />
        <PageTitle>상품 수정</PageTitle>
        <LoadingBox>상품 정보를 불러오는 중입니다.</LoadingBox>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <DatePickerStyle />
      <PageTitle>상품 수정</PageTitle>

      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>카테고리</SectionTitle>

          <CategoryTabs>
            <CategoryTabButton
              type="button"
              $active={categoryTab === "select"}
              onClick={() => setCategoryTab("select")}
            >
              카테고리 선택
            </CategoryTabButton>
            <CategoryTabButton
              type="button"
              $active={categoryTab === "search"}
              onClick={() => setCategoryTab("search")}
            >
              카테고리 검색
            </CategoryTabButton>
          </CategoryTabs>

          {categoryTab === "select" ? (
            <CategoryPanel>
              <CategoryColumn>
                {categories.map((category) => (
                  <CategoryItemButton
                    key={category.id}
                    type="button"
                    $active={selectedMainCategoryId === category.id}
                    onClick={() => {
                      setSelectedMainCategoryId(category.id);
                      setSelectedSubCategoryId(
                        category.subCategories?.[0]?.id ?? null,
                      );
                    }}
                  >
                    <span>{category.name}</span>
                    <span>{">"}</span>
                  </CategoryItemButton>
                ))}
              </CategoryColumn>

              <CategoryColumn>
                {activeMainCategory?.subCategories?.map((subCategory) => (
                  <CategoryItemButton
                    key={subCategory.id}
                    type="button"
                    $active={selectedSubCategoryId === subCategory.id}
                    onClick={() => setSelectedSubCategoryId(subCategory.id)}
                  >
                    <span>{subCategory.name}</span>
                  </CategoryItemButton>
                ))}
              </CategoryColumn>
            </CategoryPanel>
          ) : (
            <SearchCategoryPanel>
              <CategorySearchWrap>
                <SearchBar
                  value={categoryKeyword}
                  onChange={setCategoryKeyword}
                  placeholder="카테고리 검색..."
                />
              </CategorySearchWrap>

              <SearchResultList>
                {filteredCategories.map((category) =>
                  category.subCategories?.map((subCategory) => {
                    const fullName = `${category.name} > ${subCategory.name}`;
                    const isActive =
                      selectedMainCategoryId === category.id &&
                      selectedSubCategoryId === subCategory.id;

                    return (
                      <SearchResultButton
                        key={`${category.id}-${subCategory.id}`}
                        type="button"
                        $active={isActive}
                        onClick={() => {
                          setSelectedMainCategoryId(category.id);
                          setSelectedSubCategoryId(subCategory.id);
                        }}
                      >
                        {fullName}
                      </SearchResultButton>
                    );
                  }),
                )}
              </SearchResultList>
            </SearchCategoryPanel>
          )}

          <SelectedCategoryRow>
            <MiniLabel>선택된 카테고리</MiniLabel>
            <SelectedCategoryValue>
              {selectedCategoryLabel || "카테고리를 선택하세요"}
            </SelectedCategoryValue>
          </SelectedCategoryRow>
        </Section>

        <Section>
          <SectionTitle>상품정보</SectionTitle>

          <FormGrid>
            <FormRow>
              <FormLabel>상품코드</FormLabel>
              <FormField>
                <Input value={form.productCode} readOnly />
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>상품명</FormLabel>
              <FormField>
                <ProductNameWrap>
                  <ProductNameInput
                    value={form.productName}
                    onChange={(e) =>
                      handleChange("productName", e.target.value)
                    }
                    placeholder="상품명을 입력하세요"
                    maxLength={100}
                  />
                  <InnerHelperText>
                    {form.productName.length} / 100
                  </InnerHelperText>
                </ProductNameWrap>
              </FormField>
            </FormRow>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>판매상태</SectionTitle>

          <FormGrid>
            <FormRow>
              <FormLabel>판매상태</FormLabel>
              <FormField>
                <SelectBar
                  options={saleStatusOptions}
                  value={form.saleStatus}
                  onChange={(val) => handleChange("saleStatus", val)}
                  placeholder="판매상태 선택"
                  width="220px"
                  border
                  shadow={false}
                />
              </FormField>
            </FormRow>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>가격비교 정보</SectionTitle>

          <FormGrid>
            <FormRow>
              <FormLabel>카탈로그 ID</FormLabel>
              <FormField>
                <Input
                  value={form.catalogExternalId}
                  onChange={(e) =>
                    handleChange("catalogExternalId", e.target.value)
                  }
                  onBlur={handleResolveCatalogName}
                  placeholder="예: 53390091166"
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>카탈로그명</FormLabel>
              <FormField>
                <Input
                  value={form.catalogName}
                  readOnly
                  placeholder={
                    isCatalogLoading
                      ? "카탈로그 조회 중..."
                      : "자동으로 입력됩니다."
                  }
                />
                {catalogError ? (
                  <HelperText style={{ color: "#dc2626", textAlign: "left" }}>
                    {catalogError}
                  </HelperText>
                ) : null}
              </FormField>
            </FormRow>
          </FormGrid>
        </Section>

        <Section ref={aiPricingSectionRef}>
          <SectionTitle>가격정보</SectionTitle>

          <FormGrid>
            <FormRow>
              <FormLabel>판매가</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.salePrice}
                    onChange={handlePositiveNumberChange("salePrice", "판매가")}
                    inputMode="numeric"
                    $error={Boolean(fieldErrors.salePrice)}
                  />
                  <UnitText>원</UnitText>
                </UnitInputWrap>
                {fieldErrors.salePrice ? (
                  <ErrorHelperText>{fieldErrors.salePrice}</ErrorHelperText>
                ) : null}
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>원가</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.costPrice}
                    onChange={handlePositiveNumberChange("costPrice", "원가")}
                    inputMode="numeric"
                    $error={Boolean(fieldErrors.costPrice)}
                  />
                  <UnitText>원</UnitText>
                </UnitInputWrap>
                {fieldErrors.costPrice ? (
                  <ErrorHelperText>{fieldErrors.costPrice}</ErrorHelperText>
                ) : null}
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>AI 가격 변경</FormLabel>
              <FormField>
                <ToggleSwitch
                  checked={form.useAiPrice}
                  onChange={(nextChecked) => {
                    handleChange("useAiPrice", nextChecked);

                    if (!nextChecked) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        minPrice: "",
                        maxPrice: "",
                        pricePerTime: "",
                      }));
                    }
                  }}
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>최저가 제한</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.minPrice}
                    onChange={handlePositiveNumberChange(
                      "minPrice",
                      "최저가 제한",
                    )}
                    disabled={!form.useAiPrice}
                    inputMode="numeric"
                    $error={Boolean(fieldErrors.minPrice)}
                  />
                  <UnitText>원</UnitText>
                </UnitInputWrap>
                {fieldErrors.minPrice ? (
                  <ErrorHelperText>{fieldErrors.minPrice}</ErrorHelperText>
                ) : null}
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>최고가 제한</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.maxPrice}
                    onChange={handlePositiveNumberChange(
                      "maxPrice",
                      "최고가 제한",
                    )}
                    disabled={!form.useAiPrice}
                    inputMode="numeric"
                    $error={Boolean(fieldErrors.maxPrice)}
                  />
                  <UnitText>원</UnitText>
                </UnitInputWrap>
                {fieldErrors.maxPrice ? (
                  <ErrorHelperText>{fieldErrors.maxPrice}</ErrorHelperText>
                ) : null}
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>회당 조정가</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.pricePerTime}
                    onChange={handlePositiveNumberChange(
                      "pricePerTime",
                      "회당 조정가",
                    )}
                    placeholder="회당 조정가"
                    disabled={!form.useAiPrice}
                    inputMode="numeric"
                    $error={Boolean(fieldErrors.pricePerTime)}
                  />
                  <UnitText>원</UnitText>
                </UnitInputWrap>
                {fieldErrors.pricePerTime ? (
                  <ErrorHelperText>{fieldErrors.pricePerTime}</ErrorHelperText>
                ) : null}
              </FormField>
            </FormRow>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>재고정보</SectionTitle>

          <FormGrid>
            <FormRow>
              <FormLabel>재고수량</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.stockQty}
                    onChange={(e) => handleChange("stockQty", e.target.value)}
                    readOnly
                  />
                  <UnitText>개</UnitText>
                </UnitInputWrap>
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>안전재고</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.safetyStock}
                    onChange={handlePositiveNumberChange(
                      "safetyStock",
                      "안전재고",
                    )}
                    inputMode="numeric"
                    $error={Boolean(fieldErrors.safetyStock)}
                  />
                  <UnitText>개</UnitText>
                </UnitInputWrap>
                {fieldErrors.safetyStock ? (
                  <ErrorHelperText>{fieldErrors.safetyStock}</ErrorHelperText>
                ) : null}
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>유통기한</FormLabel>
              <FormField>
                <SearchDate
                  type="single"
                  selected={form.expiryDate}
                  onChange={handleExpiryDateChange}
                  placeholderText="날짜 선택"
                  width="220px"
                  border={true}
                  shadow={false}
                />
                {fieldErrors.expiryDate ? (
                  <ErrorHelperText>{fieldErrors.expiryDate}</ErrorHelperText>
                ) : null}
              </FormField>
            </FormRow>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>대표이미지</SectionTitle>

          <ImageUploadArea>
            <HiddenFileInput
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
            />

            <ImagePreviewButton
              type="button"
              onClick={() => thumbnailInputRef.current?.click()}
            >
              {thumbnailPreview ? (
                <PreviewImage src={thumbnailPreview} alt="thumbnail preview" />
              ) : (
                <UploadPlaceholder>
                  <Plus size={28} />
                </UploadPlaceholder>
              )}
            </ImagePreviewButton>

            <ImageGuide>
              {isThumbnailUploading
                ? "대표이미지 업로드 중..."
                : "권장크기 : 1000×1000 / jpg, jpeg, png, bmp"}
            </ImageGuide>
          </ImageUploadArea>
        </Section>

        <Section>
          <SectionTitle>상세설명</SectionTitle>

          <EditorWrap>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={form.description}
              onChange={(value) => handleChange("description", value)}
              modules={quillModules}
              formats={quillFormats}
            />
          </EditorWrap>

          <EditorNotice>
            {isDetailImageUploading
              ? "상세설명 이미지 업로드 중..."
              : "이미지 버튼을 누르면 상세 이미지를 추가할 수 있습니다."}
          </EditorNotice>
        </Section>

        <Section>
          <SectionTitle>기타정보</SectionTitle>

          <FormGrid>
            <FormRow>
              <FormLabel>브랜드명</FormLabel>
              <FormField>
                <Input
                  value={form.brandName}
                  onChange={(e) => handleChange("brandName", e.target.value)}
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>원산지</FormLabel>
              <FormField>
                <Input
                  value={form.origin}
                  onChange={(e) => handleChange("origin", e.target.value)}
                />
              </FormField>
            </FormRow>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>배송정보</SectionTitle>

          <FormGrid>
            <FormRow>
              <FormLabel>출하지</FormLabel>
              <FormField>
                <Input value={form.shippingFrom} readOnly />
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>배송비</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.shippingFee}
                    onChange={(e) =>
                      handleChange("shippingFee", e.target.value)
                    }
                  />
                  <UnitText>원</UnitText>
                </UnitInputWrap>
              </FormField>
            </FormRow>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>반품/교환/AS 정보</SectionTitle>

          <FormGrid>
            <FormRow>
              <FormLabel>반품/교환지</FormLabel>
              <FormField>
                <Input value={form.returnAddress} readOnly />
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>반품배송비(편도)</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.returnFee}
                    onChange={(e) => handleChange("returnFee", e.target.value)}
                    placeholder="반품배송비"
                  />
                  <UnitText>원</UnitText>
                </UnitInputWrap>
              </FormField>
            </FormRow>

            <FormRow>
              <FormLabel>교환배송비(왕복)</FormLabel>
              <FormField>
                <UnitInputWrap>
                  <Input
                    value={form.exchangeFee}
                    onChange={(e) =>
                      handleChange("exchangeFee", e.target.value)
                    }
                    placeholder="교환배송비"
                  />
                  <UnitText>원</UnitText>
                </UnitInputWrap>
              </FormField>
            </FormRow>
          </FormGrid>
        </Section>

        <BottomButtonRow>
          <CancelButton type="button" onClick={() => nav(-1)}>
            취소
          </CancelButton>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "저장 중..." : "상품수정"}
          </SubmitButton>
        </BottomButtonRow>
      </Form>
    </PageWrap>
  );
}

const PageWrap = styled.div`
  padding: 25px;
  background: var(--background);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const PageTitle = styled.h2`
  margin: 0;
  font-size: var(--title);
  font-weight: 700;
  color: var(--font);
`;

const LoadingBox = styled.div`
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: white;
  color: var(--font2);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Section = styled.section`
  padding: 18px 20px;
  box-shadow: var(--shadow);
  border-radius: 16px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SectionTitle = styled.h3`
  color: var(--font);
  font-size: 17px;
  font-weight: 600;
`;

const CategoryTabs = styled.div`
  display: inline-flex;
  width: 240px;
  height: 35px;
  border-radius: 10px;
  background: var(--choice);
  padding: 3px;
`;

const CategoryTabButton = styled.button`
  flex: 1;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "var(--blue)" : "transparent")};
  color: ${({ $active }) => ($active ? "white" : "var(--placeholder)")};
  font-size: 13px;
  font-weight: 700;
  box-shadow: ${({ $active }) => ($active ? "var(--shadow)" : "none")};
`;

const CategoryPanel = styled.div`
  display: grid;
  grid-template-columns: 220px 220px;
  gap: 12px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryColumn = styled.div`
  min-height: 40px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #ffffff;
  overflow: hidden;
`;

const CategoryItemButton = styled.button`
  width: 100%;
  min-height: 40px;
  padding: 0 14px;
  border: none;
  border-bottom: 1px solid var(--border);
  background: ${({ $active }) => ($active ? "var(--choice)" : "#ffffff")};
  color: ${({ $active }) => ($active ? "var(--blue)" : "var(--font)")};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
`;

const SearchCategoryPanel = styled.div`
  margin-bottom: 12px;
`;

const CategorySearchWrap = styled.div`
  position: relative;
  max-width: 360px;
`;

const SearchResultList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const SearchResultButton = styled.button`
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid
    ${({ $active }) => ($active ? "var(--blue)" : "var(--border)")};
  background: ${({ $active }) => ($active ? "var(--choice)" : "white")};
  color: ${({ $active }) => ($active ? "var(--blue)" : "var(--font2)")};
  font-size: 12px;
  font-weight: 600;
`;

const SelectedCategoryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const MiniLabel = styled.div`
  color: var(--font);
  font-size: 13px;
  font-weight: 500;
`;

const SelectedCategoryValue = styled.div`
  min-height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  color: var(--font);
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
`;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 14px;
  align-items: center;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const FormLabel = styled.label`
  color: var(--font);
  font-size: 13px;
  font-weight: 500;
`;

const FormField = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid ${({ $error }) => ($error ? "#ef4444" : "var(--border)")};
  border-radius: 10px;
  background: ${({ readOnly, disabled }) =>
    disabled || readOnly ? "var(--read-only)" : "white"};
  color: var(--font);
  font-size: 13px;

  &:focus {
    border-color: ${({ $error }) =>
      $error ? "#ef4444" : "var(--focus-border)"};
  }
`;

const ProductNameWrap = styled.div`
  position: relative;
  width: 100%;
`;

const ProductNameInput = styled(Input)`
  padding-right: 70px;
`;

const InnerHelperText = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: var(--placeholder);
  font-size: 11px;
  pointer-events: none;
  user-select: none;
`;

const HelperText = styled.div`
  margin-top: 6px;
  color: var(--placeholder);
  font-size: 12px;
  text-align: right;
`;

const ErrorHelperText = styled.div`
  margin-top: 2px;
  color: #ef4444;
  font-size: 12px;
  line-height: 1.2;
  text-align: left;
  font-weight: 500;
`;

const UnitInputWrap = styled.div`
  position: relative;
  max-width: 220px;
`;

const UnitText = styled.span`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: var(--placeholder);
  font-size: 12px;
  font-weight: 600;
`;

const ImageUploadArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImagePreviewButton = styled.button`
  width: 160px;
  height: 160px;
  border: 1px dashed var(--border);
  border-radius: 14px;
  background: var(--choice);
  overflow: hidden;
  padding: 0;
`;

const UploadPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  color: var(--placeholder);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageGuide = styled.div`
  color: var(--placeholder);
  font-size: 12px;
  line-height: 1.6;
`;

const EditorWrap = styled.div`
  .ql-toolbar.ql-snow {
    border: 1px solid var(--border);
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
  }

  .ql-container.ql-snow {
    border: 1px solid var(--border);
    border-top: none;
    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 14px;
    min-height: 320px;
    background: white;
  }

  .ql-editor {
    min-height: 320px;
    font-size: 14px;
    line-height: 1.8;
    color: var(--font);
    word-break: break-word;
  }

  .ql-editor img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 14px 0;
    float: none !important;
  }

  .ql-editor p,
  .ql-editor h1,
  .ql-editor h2,
  .ql-editor h3,
  .ql-editor h4,
  .ql-editor h5,
  .ql-editor h6,
  .ql-editor ul,
  .ql-editor ol,
  .ql-editor blockquote,
  .ql-editor pre {
    clear: both;
  }

  .ql-editor .ql-align-center img {
    margin-left: auto;
    margin-right: auto;
  }

  .ql-editor .ql-align-right img {
    margin-left: auto;
  }

  .ql-editor pre.ql-syntax {
    background: #111827;
    color: #f9fafb;
    padding: 14px 16px;
    border-radius: 12px;
    overflow-x: auto;
  }
`;

const EditorNotice = styled.div`
  margin-top: 10px;
  color: var(--placeholder);
  font-size: 12px;
`;

const BottomButtonRow = styled.div`
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const CancelButton = styled.button`
  min-width: 96px;
  height: 40px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: white;
  color: var(--font2);
  font-size: 13px;
  font-weight: 700;
`;

const SubmitButton = styled.button`
  min-width: 96px;
  height: 40px;
  background: var(--blue);
  color: white;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;

  &:disabled {
    opacity: 0.6;
  }
`;