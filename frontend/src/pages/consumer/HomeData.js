import shinramyunImg from "../../assets/shinramyeon.jpg";
import cocacolaImg from "../../assets/cocacola.jpg";
import jjajangImg from "../../assets/jjajang.jpg";
import potetochipImg from "../../assets/potetochip.webp";
import seawookkangImg from "../../assets/seowookkang.webp";
import sosiziImg from "../../assets/sosizi.jpg";

import chilsungImg from "../../assets/chilsung.png";
import cocacolaBrandImg from "../../assets/cocacola.png";
import nongsimImg from "../../assets/nongsim.png";
import oddugiImg from "../../assets/oddugi.png";
import orionImg from "../../assets/orion.png";
import paldoImg from "../../assets/paldo.png";
import samyangImg from "../../assets/samyang.png";

export const bestItems = [
  {
    id: 1,
    name: "농심 신라면, 120g, 5개",
    rating: "4.5/5",
    price: "4,150원",
    originalPrice: "5,000원",
    discount: "-17%",
    image: shinramyunImg,
    imageScale: 0.7,
  },
  {
    id: 2,
    name: "코카콜라 캔 190ml, 30개",
    rating: "3.5/5",
    price: "16,630원",
    originalPrice: "33,690원",
    discount: "-50%",
    image: cocacolaImg,
    imageScale: 0.79,
  },
  {
    id: 3,
    name: "오뚜기 3분 쇠고기 짜장 200g, 1개",
    rating: "4.5/5",
    price: "980원",
    originalPrice: "840원",
    discount: "+16%",
    image: jjajangImg,
    imageScale: 0.69,
  },
  {
    id: 4,
    name: "농심 포테토칩 오리지널 60g, 1개",
    rating: "4.5/5",
    price: "5,480원",
    originalPrice: "5,680원",
    discount: "-4%",
    image: potetochipImg,
    imageScale: 0.82,
  },
];

export const hotDealItems = [
  {
    id: 1,
    name: "농심 새우깡 오리지널, 90g, 1개",
    rating: "5.0/5",
    price: "900원",
    originalPrice: "1,050원",
    discount: "-14%",
    image: seawookkangImg,
    imageScale: 0.82,
  },
  {
    id: 2,
    name: "롯데 맛있는 비엔나 소시지 1kg, 1개",
    rating: "4.0/5",
    price: "5,860원",
    originalPrice: "7,250원",
    discount: "-19%",
    image: sosiziImg,
    imageScale: 0.75,
  },
  {
    id: 3,
    name: "코카콜라 캔 190ml, 30개",
    rating: "3.5/5",
    price: "16,630원",
    originalPrice: "33,690원",
    discount: "-50%",
    image: cocacolaImg,
    imageScale: 0.82,
  },
  {
    id: 4,
    name: "농심 신라면, 120g, 5개",
    rating: "4.5/5",
    price: "4,150원",
    originalPrice: "5,000원",
    discount: "-17%",
    image: shinramyunImg,
    imageScale: 0.82,
  },
];

export const brandLogos = [
  { id: 1, src: samyangImg, alt: "삼양", scale: 2.5 },
  { id: 2, src: oddugiImg, alt: "오뚜기", scale: 0.9 },
  { id: 3, src: nongsimImg, alt: "농심", scale: 0.9 },
  { id: 4, src: orionImg, alt: "오리온", scale: 2.5 },
  { id: 5, src: paldoImg, alt: "팔도", scale: 0.9 },
  { id: 6, src: cocacolaBrandImg, alt: "코카콜라", scale: 0.9 },
  { id: 7, src: chilsungImg, alt: "칠성", scale: 0.9 },
];
