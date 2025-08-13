import type { TypedObject } from "@portabletext/types";

export interface AccordionSection {
  title: string;
  slug: string;
  body: TypedObject[];         
}

export interface AccordionPageData {
  isEnabled?: boolean;
  intro: TypedObject[];        
  sections: AccordionSection[]; 
}