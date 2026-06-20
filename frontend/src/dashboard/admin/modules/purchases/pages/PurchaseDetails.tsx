import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CreditCard } from "lucide-react";

import { getPurchaseDetails } from "../services/purchasesApi";
import type { Purchase } from "../types/purchase.types";

function formatDate(value: string | null) {
  if (!value) return "Not completed";

  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function PurchaseDetails() {
  const { id } = useParams();

  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchPurchase() {
      if (!id) {
        setError("Purchase ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const data = await getPurchaseDetails(Number(id));

        if (isMounted) {
          setPurchase(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load purchase details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPurchase();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500">
        Loading purchase details...
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm font-bold text-red-600">
        {error || "Purchase not found."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Purchase Details #{purchase.id}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Full purchase information, payment status, student, and course.
          </p>
        </div>

        <Link
          to="/admin/purchases"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
        >
          <ArrowLeft size={18} />
          Back to Purchases
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
            <CreditCard size={24} />
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-900">
              Payment Summary
            </h2>
            <p className="text-sm text-slate-500">
              Current status: {purchase.status}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InfoItem label="Purchase ID" value={`#${purchase.id}`} />
          <InfoItem label="Status" value={purchase.status} />
          <InfoItem label="Amount" value={`${purchase.amount} JOD`} />
          <InfoItem label="Provider" value={purchase.provider || "internal"} />
          <InfoItem
            label="Provider Reference"
            value={purchase.provider_reference || "None"}
          />
          <InfoItem label="Completed At" value={formatDate(purchase.completed_at)} />
          <InfoItem label="Created At" value={formatDate(purchase.created_at)} />
          <InfoItem label="Updated At" value={formatDate(purchase.updated_at)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-black text-slate-900">
            Student Information
          </h2>

          <div className="space-y-3">
            <InfoItem
              label="Student Name"
              value={purchase.student_name || `Student #${purchase.student}`}
            />
            <InfoItem label="Student Email" value={purchase.student_email || "No email"} />
            <InfoItem label="Student ID" value={String(purchase.student)} />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-black text-slate-900">
            Course Information
          </h2>

          <div className="space-y-3">
            <InfoItem
              label="Course Title"
              value={purchase.course_title || `Course #${purchase.course}`}
            />
            <InfoItem label="Course ID" value={String(purchase.course)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-bold text-slate-800">{value}</p>
    </div>
  );
}

export default PurchaseDetails;