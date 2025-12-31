import { useState, memo } from 'react';
import { Filter, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { CandidateFiltersProps } from '@/types';
import { useCandidateFilters } from '@/context/candidateListContext';

const statuses = ['All', 'New', 'Screening', 'Interviewed', 'Pass', 'Fail', 'On Hold'];
const experienceRanges = ['All', '0-2', '3-5', '6+'];
const sortOptions = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'experience-desc', label: 'Experience (High-Low)' },
  { value: 'experience-asc', label: 'Experience (Low-High)' },
];

function CandidateFilters({ positions }: CandidateFiltersProps) {
  const { filters, dispatch } = useCandidateFilters();
  const [showFilters, setShowFilters] = useState(false);
  console.log("Rendered ", "CandidateFilters")


  return (
    <div className="mb-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3  ">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2.5 border rounded-md cursor-pointer  bg-white hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm flex items-center justify-center gap-2 font-medium text-gray-700 sm:w-auto whitespace-nowrap"
          title={showFilters ? 'Hide filters' : 'Show filters'}
        >
          {showFilters ? <X size={20} /> : <Filter size={20} />}
          <span className="hidden sm:inline">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>

        {showFilters && (
          <>
            <Input
              placeholder="Search by name, email, position..."
              value={filters.search}
              onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
              className="w-full sm:flex-1 sm:max-w-xs border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <Select value={filters.position} onValueChange={(value) => dispatch({ type: 'SET_POSITION', payload: value })}>
              <SelectTrigger className="w-full sm:w-40 border-gray-300 bg-white hover:border-blue-400 cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent position="popper" className='bg-white border-gray-200'>
                <SelectItem className="focus:bg-blue-50 focus:text-blue-900" value="All">All Positions</SelectItem>
                {positions.map((pos) => (
                  <SelectItem className="focus:bg-blue-50 focus:text-blue-900" key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => dispatch({ type: 'SET_STATUS', payload: value })}>
              <SelectTrigger className="w-full sm:w-40 border-gray-300 bg-white cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent position="popper" className='bg-white border-gray-200'>
                {statuses.map((s) => (
                  <SelectItem className="focus:bg-blue-50 focus:text-blue-900" key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.experience} onValueChange={(value) => dispatch({ type: 'SET_EXPERIENCE', payload: value })}>
              <SelectTrigger className="w-full sm:w-40 border-gray-300 bg-white cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent position="popper" className='bg-white border-gray-200'>
                {experienceRanges.map((exp) => (
                  <SelectItem className="focus:bg-blue-50 focus:text-blue-900" key={exp} value={exp}>
                    {exp === 'All' ? 'All Experience' : `${exp} years`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sortBy} onValueChange={(value) => dispatch({ type: 'SET_SORT_BY', payload: value })}>
              <SelectTrigger className="w-full sm:w-44 border-gray-300 bg-white cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent position="popper" className='bg-white border-gray-200'>
                {sortOptions.map((opt) => (
                  <SelectItem className="focus:bg-blue-50 focus:text-blue-900" key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>
    </div>
  );
}

export default memo(CandidateFilters);
