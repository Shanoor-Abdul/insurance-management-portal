import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "./Input";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SearchInput = ({ className, ...props }: SearchInputProps) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    <Input className={`pl-9 ${className || ""}`} {...props} />
  </div>
);
