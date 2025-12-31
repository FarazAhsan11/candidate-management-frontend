import type { Candidate } from "../../types/candidate";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useState, useEffect } from "react";
import LoomPlayer from 'react-loom-player';
import { useAuth } from "@/context/authContext";
import {
  ChevronLeft,
  ChevronRight,
  FileUser,
  BriefcaseBusiness,
  Wallet,
  Download,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs"
import InfoCard from "../../components/infoCard";
import InfoRow from "../../components/infoRow";
import { ScrollArea } from "@/components/ui/scroll-area";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  candidate: Candidate;
}

export default function CandidateInfo({ candidate }: Props) {
  const [pdfWidth, setPdfWidth] = useState(400);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const {user} = useAuth();

  useEffect(() => {
    const updatePdfWidth = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setPdfWidth(280);
      } else if (width < 1024) {
        setPdfWidth(600);
      } else if (width < 1536) {
        setPdfWidth(700);
      } else {
        setPdfWidth(850);
      }
    };

    updatePdfWidth();
    window.addEventListener('resize', updatePdfWidth);
    return () => window.removeEventListener('resize', updatePdfWidth);
  }, []);

  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col xl:col-span-2 overflow-hidden">
        <Tabs defaultValue="resume" className="flex flex-col px-2 border rounded-md h-full">
          <TabsList className="bg-transparent border-b border-gray-200 px-2 rounded-none h-auto gap-6 justify-start shrink-0">
            <TabsTrigger value="resume" className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 cursor-pointer rounded-md pb-3 pt-4 px-1 font-medium text-gray-600 hover:text-blue-600 transition-colors border-b-2 border-transparent">Resume</TabsTrigger>
            <TabsTrigger value="loom-video" className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 cursor-pointer rounded-md pb-3 pt-4 px-1 font-medium text-gray-600 hover:text-blue-600 transition-colors border-b-2 border-transparent">Loom Video</TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="flex-1 overflow-hidden m-0 p-4 data-[state=active]:flex data-[state=active]:flex-col">
            {candidate.resumeFile ? (
              <div className="flex flex-col flex-1 min-h-0">
                <ScrollArea className="flex-1 min-h-0">
                  <div className="flex justify-center p-2">
                    <Document
                      file={candidate.resumeFile}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <Page pageNumber={pageNumber} width={pdfWidth} />
                    </Document>
                  </div>
                </ScrollArea>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-2 text-gray-900 shrink-0">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button
                      disabled={pageNumber <= 1}
                      onClick={() => setPageNumber(pageNumber - 1)}
                      className="p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 cursor-pointer transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                      Page {pageNumber} of {numPages}
                    </span>
                    <button
                      disabled={pageNumber >= (numPages || 1)}
                      onClick={() => setPageNumber(pageNumber + 1)}
                      className="p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 cursor-pointer transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-emerald-600 text-white border-none hover:bg-emerald-700 cursor-pointer hover:text-white shadow-sm"
                    onClick={() => window.open(candidate.resumeFile, "_blank")}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">No resume uploaded</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="loom-video" className="flex-1 overflow-hidden m-0 p-4 data-[state=active]:flex data-[state=active]:flex-col">
            {candidate.loomLink ? (
              <ScrollArea className="flex-1 min-h-0">
                <div className="relative [&_iframe]:max-w-full">
                  {isVideoLoading && (
                    <div className="absolute bg-[#dedbd2] inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4a2c1a]"></div>
                    </div>
                  )}
                  <LoomPlayer
                    src={candidate.loomLink}
                    autoplay
                    muted
                    timestamps={30}
                    onLoad={() => setIsVideoLoading(false)}
                  />
                </div>
              </ScrollArea>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">No Video Available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {user?.role === 'hr' && (
        <div className="flex flex-col xl:col-span-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 pr-4">
              <InfoCard title="BASIC INFO" icon={<FileUser />}>
                <InfoRow label="Name" value={candidate.name} />
                <InfoRow label="Email" value={candidate.email} />
                <InfoRow label="Phone" value={candidate.phone} />
                <InfoRow label="City" value={candidate.city} />
              </InfoCard>

              <InfoCard title="PROFESSIONAL" icon={<BriefcaseBusiness />}>
                <InfoRow label="Current" value={candidate.currentPosition} />
                <InfoRow label="Company" value={candidate.currentCompany} />
                <InfoRow label="Experience" value={`${candidate.experienceYears} years`} />
                <InfoRow label="Notice" value={candidate.noticePeriod} />
              </InfoCard>

              <InfoCard title="EDUCATION" icon={<FileUser />}>
                <InfoRow label="Institute" value={candidate.institute} />
                <InfoRow label="Degree" value={candidate.educationLevel} />
                <InfoRow label="Year" value={candidate.graduationYear} />
              </InfoCard>

              <InfoCard title="COMPENSATION" icon={<Wallet />}>
                <InfoRow label="Current" value={candidate.currentSalary} />
                <InfoRow label="Expected" value={candidate.expectedSalary} />
                {!!candidate.expectedSalaryPartTime && (
                  <InfoRow label="Part-time" value={candidate.expectedSalaryPartTime} />
                )}
              </InfoCard>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
