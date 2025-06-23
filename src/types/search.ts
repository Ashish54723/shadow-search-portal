
export interface SearchString {
  id: string;
  string_value: string;
  translations: Record<string, string>;
  is_active: boolean;
}

export interface SearchResultData {
  searchStrings: string[];
  searchNames: string[];
}
