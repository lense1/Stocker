import { plainApi } from "./axios";
import api from "./axios";

export const getHomeAiRanking = async () => {
  return {
    priceDropTop5ByCategory: [
      {
        categoryId: "ramen",
        categoryName: "라면",
        items: [
          { name: "신라면", dropAmount: 1200, dropRate: 12.4 },
          { name: "안성탕면", dropAmount: 980, dropRate: 10.1 },
          { name: "짜파게티", dropAmount: 850, dropRate: 8.7 },
          { name: "진라면", dropAmount: 620, dropRate: 6.2 },
          { name: "너구리", dropAmount: 500, dropRate: 5.1 },
        ],
      },
      {
        categoryId: "snack",
        categoryName: "과자",
        items: [
          { name: "포테토칩", dropAmount: 700, dropRate: 9.8 },
          { name: "새우깡", dropAmount: 520, dropRate: 7.2 },
          { name: "초코파이", dropAmount: 410, dropRate: 5.9 },
          { name: "오징어땅콩", dropAmount: 300, dropRate: 4.1 },
          { name: "꼬북칩", dropAmount: 250, dropRate: 3.8 },
        ],
      },
    ],
    categories: [
      {
        id: "ramen",
        name: "라면",
        products: [
          {
            id: "shin",
            name: "신라면(농심)",
            currentPrice: 3000,
            weekCompare: -200,
            twoWeekCompare: 100,
            weekly: {
              labels: ["4주전", "3주전", "2주전", "1주전", "현재"],
              series: [
                {
                  name: "Value",
                  color: "#1d63ff",
                  values: [6, 15, 38, 41, 60],
                },
                {
                  name: "Value",
                  color: "#ff5a5a",
                  values: [6, 10, 18, 31, 40],
                },
                { name: "Value", color: "#19b86b", values: [6, 9, 20, 25, 35] },
                {
                  name: "Value",
                  color: "#f0b64b",
                  values: [6, 11, 17, 24, 29],
                },
              ],
              lastValues: [123.2, 125.2, 115.3, 90.6],
            },
            monthly: {
              labels: ["1월", "2월", "3월", "4월", "5월"],
              series: [
                {
                  name: "Value",
                  color: "#1d63ff",
                  values: [18, 26, 39, 52, 61],
                },
                {
                  name: "Value",
                  color: "#ff5a5a",
                  values: [14, 20, 28, 36, 42],
                },
                {
                  name: "Value",
                  color: "#19b86b",
                  values: [12, 18, 24, 31, 37],
                },
                {
                  name: "Value",
                  color: "#f0b64b",
                  values: [10, 16, 20, 25, 31],
                },
              ],
              lastValues: [132.4, 120.6, 116.8, 95.1],
            },
          },
          {
            id: "ansung",
            name: "안성탕면(농심)",
            currentPrice: 2800,
            weekCompare: 120,
            twoWeekCompare: -80,
            weekly: {
              labels: ["4주전", "3주전", "2주전", "1주전", "현재"],
              series: [
                {
                  name: "Value",
                  color: "#1d63ff",
                  values: [8, 12, 20, 29, 40],
                },
                {
                  name: "Value",
                  color: "#ff5a5a",
                  values: [7, 11, 18, 22, 30],
                },
                { name: "Value", color: "#19b86b", values: [6, 9, 15, 20, 28] },
                { name: "Value", color: "#f0b64b", values: [5, 8, 14, 18, 24] },
              ],
              lastValues: [101.1, 97.2, 89.3, 82.4],
            },
            monthly: {
              labels: ["1월", "2월", "3월", "4월", "5월"],
              series: [
                {
                  name: "Value",
                  color: "#1d63ff",
                  values: [13, 17, 24, 33, 42],
                },
                {
                  name: "Value",
                  color: "#ff5a5a",
                  values: [10, 15, 20, 27, 34],
                },
                {
                  name: "Value",
                  color: "#19b86b",
                  values: [8, 12, 18, 23, 29],
                },
                {
                  name: "Value",
                  color: "#f0b64b",
                  values: [7, 10, 15, 19, 24],
                },
              ],
              lastValues: [110.2, 103.8, 96.4, 88.9],
            },
          },
        ],
      },
      {
        id: "snack",
        name: "과자",
        products: [
          {
            id: "potato",
            name: "포테토칩(농심)",
            currentPrice: 2100,
            weekCompare: -50,
            twoWeekCompare: 70,
            weekly: {
              labels: ["4주전", "3주전", "2주전", "1주전", "현재"],
              series: [
                {
                  name: "Value",
                  color: "#1d63ff",
                  values: [5, 10, 14, 18, 23],
                },
                { name: "Value", color: "#ff5a5a", values: [4, 8, 13, 16, 19] },
                { name: "Value", color: "#19b86b", values: [3, 7, 11, 14, 17] },
                { name: "Value", color: "#f0b64b", values: [2, 6, 9, 12, 15] },
              ],
              lastValues: [88.4, 85.1, 78.3, 70.2],
            },
            monthly: {
              labels: ["1월", "2월", "3월", "4월", "5월"],
              series: [
                {
                  name: "Value",
                  color: "#1d63ff",
                  values: [8, 12, 18, 21, 26],
                },
                {
                  name: "Value",
                  color: "#ff5a5a",
                  values: [7, 10, 15, 19, 22],
                },
                { name: "Value", color: "#19b86b", values: [6, 9, 13, 17, 20] },
                { name: "Value", color: "#f0b64b", values: [5, 8, 11, 14, 18] },
              ],
              lastValues: [92.1, 86.3, 81.2, 73.9],
            },
          },
        ],
      },
    ],
  };

  // 실제 연동 시
  // const response = await plainApi.get("/stats/home-ai-ranking");
  // return response.data;


};

  export const getAdminSalesStat = async (params) => {
    const response = await api.get("/admin/price/sales-stat", {
      params,
    });
    return response.data;
  };