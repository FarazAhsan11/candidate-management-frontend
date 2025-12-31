import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { candidateService } from '@/services/candidateService';
import type { Candidate } from '@/types';
import CandidateInfo from './candidateInfo';
import RemarksWidget from './remarksWidget';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/loading-spinner';

export default function CandidateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remarksOpen, setRemarksOpen] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await candidateService.getById(id);
        setCandidate(data);
      } catch (err) {
        setError('Failed to load candidate');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
          <p className="text-red-500 font-semibold text-lg">{error || 'Candidate not found'}</p>
          <Button onClick={() => navigate('/')} className="mt-4 bg-blue-600 hover:bg-blue-700">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <div className="px-4 sm:px-8 lg:px-16">
        <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-4 mt-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>

          <Button
            onClick={() => setRemarksOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm cursor-pointer"
          >
            <MessageCircle size={18} />
            Remarks & Status
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-4 sm:px-8 lg:px-16 pb-4">
        <CandidateInfo candidate={candidate} />
      </div>

      <RemarksWidget
        candidate={candidate}
        onUpdate={setCandidate}
        open={remarksOpen}
        onOpenChange={setRemarksOpen}
      />
    </div>
  );
}
