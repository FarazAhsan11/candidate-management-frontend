import { useState, useEffect } from "react";
import { candidateService } from "@/services/candidateService";
import type { Candidate, RemarksWidgetProps } from "@/types";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusOptions = [
  "New",
  "Screening",
  "Interviewed",
  "Pass",
  "Fail",
  "On Hold",
] as const;

export default function RemarksWidget({
  candidate,
  onUpdate,
  open,
  onOpenChange,
}: RemarksWidgetProps) {
  const [hrRemarks, setHrRemarks] = useState(candidate.hrRemarks || "");
  const [interviewerRemarks, setInterviewerRemarks] = useState(
    candidate.interviewerRemarks || ""
  );
  console.log("Rendered RemarksWidget")
  const [status, setStatus] = useState(candidate.status);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setHrRemarks(candidate.hrRemarks || "");
    setInterviewerRemarks(candidate.interviewerRemarks || "");
    setStatus(candidate.status);
  }, [candidate]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const updateData: Partial<Candidate> = {
        hrRemarks,
        interviewerRemarks,
        status,
      };
      const updated = await candidateService.update(candidate._id, updateData);
      onUpdate(updated);
      toast.success("Remarks updated successfully");
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to update remarks");
      toast.error("Failed to update remarks");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 shadow-xl sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
            REMARKS & STATUS
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Add or update remarks and status for{" "}
            <span className="font-semibold text-gray-900">
              {candidate.name}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 mt-3 sm:mt-4">
          {user?.role === "hr" && (
            <div>
              <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">
                HR Remarks
              </label>
              <textarea
                value={hrRemarks}
                onChange={(e) => setHrRemarks(e.target.value)}
                className={`w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 sm:p-3 min-h-24 sm:min-h-28 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base`}
                placeholder="Enter HR remarks..."
              />
            </div>
          )}

          {user?.role === "interviewer" && (
            <div>
              <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">
                Interviewer Remarks
              </label>
              <textarea
                value={interviewerRemarks}
                onChange={(e) => setInterviewerRemarks(e.target.value)}
                className={`w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 sm:p-3 min-h-24 sm:min-h-28 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base`}
                placeholder="Enter interviewer remarks..."
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              Status
            </label>
            <RadioGroup
              value={status}
              onValueChange={(value) => setStatus(value as Candidate["status"])}
            >
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {statusOptions.map((opt) => (
                  <div
                    key={opt}
                    className="flex items-center space-x-2  hover:bg-gray-100  rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 transition-colors cursor-pointer"
                  >
                    <RadioGroupItem
                      value={opt}
                      id={opt}
                      className="border-2 cursor-pointer border-gray-400 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <Label
                      htmlFor={opt}
                      className="text-xs sm:text-sm text-gray-900 font-medium cursor-pointer whitespace-nowrap"
                    >
                      {opt}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 sm:py-2.5 rounded-lg cursor-pointer transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-2.5 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm text-sm sm:text-base"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
