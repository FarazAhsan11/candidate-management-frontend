import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { candidateService } from '@/services/candidateService';
import type { CandidateResponse } from '@/services/candidateService';
import type { Candidate } from '@/types/candidate';
import CandidateList from './candidateList';
import CandidateFilters from './candidateFilters';
import AddCandidateModal from './addCandidateModal';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/context/authContext';
import { CandidateListProvider, useCandidateFilters } from '@/context/candidateListContext';
import { LogOut, User, Plus, KeyRound, MoreVertical } from 'lucide-react';
import ChangePasswordModal from '@/components/change-password';
import LoadingSpinner from '@/components/loading-spinner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ITEMS_PER_PAGE = 12;

export default function CandidateListPage() {
  return (
    <CandidateListProvider>
      <CandidateListPageContent />
    </CandidateListProvider>
  );
}

function CandidateListPageContent() {
  const { user, logout } = useAuth();
  const { filters } = useCandidateFilters();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate|null>(null);

  const debouncedSearch = useDebounce(filters.search, 500);

  console.log("Rendered ", "CandidateListPageContent");

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: CandidateResponse = await candidateService.getAll({
        search: debouncedSearch || undefined,
        position: filters.position !== 'All' ? filters.position : undefined,
        status: filters.status !== 'All' ? filters.status : undefined,
        experience: filters.experience !== 'All' ? filters.experience : undefined,
        sortBy: filters.sortBy,
        page: filters.currentPage,
        limit: ITEMS_PER_PAGE,
      });

      setCandidates(response.candidates);
      setPositions(response.positions);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError('Failed to fetch candidates');
      console.error(err);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [debouncedSearch, filters.position, filters.status, filters.experience, filters.sortBy, filters.currentPage]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleAddCandidate = useCallback(async (formData: FormData, candidateId?:string) => {
    try {
      if(candidateId){
        await candidateService.update(candidateId,formData);
        toast.success('Candidate Updated Successfully!')
      }
      else{
        await candidateService.create(formData);
        toast.success('Candidate added successfully!');

      }
      
      setIsModalOpen(false);
      setSelectedCandidate(null);
      fetchCandidates();
    } catch (err) {
      toast.error(candidateId ? 'Failed to update candidate.' : 'Failed to add candidate.');
    }
  }, [fetchCandidates]);

  const handleEdit = useCallback((candidate:Candidate)=>{
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await candidateService.delete(id);
      toast.success('Candidate deleted successfully!');
      fetchCandidates();
    } catch (err) {
      toast.error('Failed to delete candidate.');
    }
  }, [fetchCandidates]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  if (isInitialLoad && loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error && isInitialLoad) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-2 sm:p-4 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 border rounded-xl border-gray-200 bg-white shadow-sm px-4 sm:px-8 mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Candidates Management Dashboard
        </h1>
        
        <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-sm px-4 py-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Candidate
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {user?.name}
                </span>
                {user?.role === 'admin' && (
                  <span className="px-2 py-0.5 text-xs cursor-pointer font-semibold bg-blue-600 text-white rounded">
                    Admin
                  </span>
                )}
                <MoreVertical className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setIsChangePasswordModalOpen(true)}>
                <KeyRound className="w-4 h-4 mr-2" />
                <span className='cursor-pointer w-full'>Change Password</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className='w-full cursor-pointer'>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CandidateFilters positions={positions} />

      <CandidateList
        candidates={candidates}
        onDelete={handleDelete}
        totalPages={totalPages}
        loading={loading}
        onEdit={handleEdit}
      />

      <AddCandidateModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddCandidate}
        candidate={selectedCandidate}
      />

      <ChangePasswordModal
        open={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
}
