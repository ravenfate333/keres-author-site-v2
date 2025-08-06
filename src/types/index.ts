// This file defines shared TypeScript interfaces for the application's data structures.
export interface RgbaColor {
    r: number;
    g: number;
    b: number;
    a: number;
  }
  
  export interface Book {
    _id: string;
    title: string;
    bookNumber?: number;
    bookNumberLabel?: string;
    coverImage: {
      asset: {
        url: string;
      };
    };
    blurb: any[];
    retailerButtons?: {
      _key: string;
      label: string;
      link: string;
    }[];
    themeColor?: {
      hex: string;
      rgb: RgbaColor;
    };
  }