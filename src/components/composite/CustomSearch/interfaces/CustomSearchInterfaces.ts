import { SearchResultType } from '../enums/CustomSearchEnums';

export interface IBaseOption {
  label: string;
  value: number;
}

export interface ICustomSearchProps {
  onChange?: (query: string) => void;
}

export interface IDynamicCustomResultRendererProps {
  searchResultType: SearchResultType;
  searchResults?: IBaseOption[];
  onOptionClick?: (option: IBaseOption | string) => void;
  highlight?: string;
  setShowResults: any;
  datePickerPosition: any;
  isLoading: boolean;
  showEmptyOption: boolean;
}

export interface ISingleSelectSearchResult {
  options: IBaseOption[];
  onOptionClick: (option: IBaseOption) => void;
  highlight?: string;
  setShowResults: any;
  isLoading: boolean;
  showEmptyOption: boolean;
}
