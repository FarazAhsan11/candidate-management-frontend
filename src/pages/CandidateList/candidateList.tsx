import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Calendar, Pencil } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IdCard, Table as TableIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Candidate } from "@/types/candidate";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";


const getStatusVariant = (status: string) => {
  switch (status) {
    case "Pass":
      return "default";
    case "Fail":
      return "destructive";
    case "On Hold":
      return "secondary";
    default:
      return "outline";
  }
};

interface Props {
  candidates: Candidate[];
  onDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  onEdit: (candidate: Candidate) => void;
}

export default function CandidateList({
  candidates,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  loading = false,
}: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"cards" | "table">("table");
  const navigate = useNavigate();

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const handleCardClick = (id: string) => {
    navigate(`/candidate/${id}`);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "cards" | "table");
    onPageChange(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 w-full flex items-start justify-center pt-20">
        <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-500 text-lg">No candidates found.</p>
        <p className="text-gray-400 text-sm mt-2">
          Try adjusting your filters or add a new candidate.
        </p>
      </div>
    );
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="bg-white border border-gray-200 rounded-lg shadow-sm p-1">
          <TabsTrigger
            className="cursor-pointer data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            value="cards"
          >
            <IdCard className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger
            className="cursor-pointer data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            value="table"
          >
            <TableIcon className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "cards" && (
        <>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 px-2 sm:px-0">
              {candidates.map((candidate) => (
                <Card
                  key={candidate._id}
                  onClick={() => handleCardClick(candidate._id)}
                  className="bg-white my-2 sm:my-6 border border-gray-200 group cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200"
                >
                  <CardHeader className="p-6 pb-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                          {candidate.name}
                        </CardTitle>
                        <CardDescription className="text-gray-600 text-base font-medium">
                          {candidate.appliedPosition}
                        </CardDescription>
                      </div>
                      <Badge
                        className="text-sm font-semibold px-3 py-1 mt-1"
                        variant={getStatusVariant(candidate.status)}
                      >
                        {candidate.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          {candidate.experienceYears} years experience
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(candidate);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-md transition-all cursor-pointer"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(candidate._id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-all cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className={`cursor-pointer w-9 h-9 p-0 text-sm font-medium rounded-lg transition-all ${
                      currentPage === page
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                    }`}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
          )}
        </>
      )}


      {activeTab === "table" && (
  <>
    <div className="mt-4 rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
      <div className="bg-linear-to-r from-blue-600 to-blue-700">
        <table className="w-full">
          <thead>
            <tr className="border-none">
              <th className="text-white font-semibold text-left pl-4 py-3 w-[20%]">
                Name
              </th>
              <th className="text-white font-semibold text-left py-3  w-[25%]">
                Position
              </th>
              <th className="text-white font-semibold text-left py-3 w-[20%]">
                Status
              </th>
              <th className="text-white font-semibold text-left py-3  w-[20%]">
                Experience
              </th>
              <th className="text-white font-semibold text-right pr-4 py-3 w-[15%]">
                Actions
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <ScrollArea className="h-[calc(100vh-380px)] min-h-75">
        <Table>
          <colgroup>
            <col className="w-[19%]" />
            <col className="w-[25%]" />
            <col className="w-[20%]" />
            <col className="w-[20%]" />
            <col className="w-[15%]" />
          </colgroup>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow
                key={candidate._id}
                onClick={() => handleCardClick(candidate._id)}
                className="cursor-pointer hover:bg-blue-50 transition-colors border-gray-300"
              >
                <TableCell className="font-semibold text-gray-900 pl-4">
                  {candidate.name}
                </TableCell>
                <TableCell className="text-gray-600">
                  {candidate.appliedPosition}
                </TableCell>
                <TableCell>
                  <Badge
                    className="font-medium"
                    variant={getStatusVariant(candidate.status)}
                  >
                    {candidate.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">
                  {candidate.experienceYears} years
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(candidate._id);
                    }}
                    className="text-red-500 hover:text-red-700 pr-4 p-2 rounded-lg transition-all cursor-pointer inline-flex"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(candidate);
                    }}
                    className="text-blue-500 hover:text-blue-700 p-2 rounded-lg transition-all cursor-pointer inline-flex"
                  >
                    <Pencil size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>

    {totalPages > 1 && (
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`cursor-pointer w-9 h-9 p-0 text-sm font-medium rounded-lg transition-all ${
                currentPage === page
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
              }`}
            >
              {page}
            </Button>
          )
        )}
      </div>
    )}
  </>
)}


      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white w-[90%] max-w-md rounded-xl border border-gray-200 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete the
              candidate data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-2">
            <AlertDialogCancel className="cursor-pointer w-full sm:w-auto border-gray-300 hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 cursor-pointer w-full sm:w-auto shadow-sm"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
